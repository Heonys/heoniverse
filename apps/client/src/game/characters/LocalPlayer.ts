import {
  Direction,
  ExtendedCursorKeys,
  ItemType,
  PlayerBehavior,
  sittingOffset,
  KICK_DIR,
  KICK_FORCE,
  KICK_RANGE,
  KICK_DELAY_MS,
} from "@/constants/game";
import { Player, PlayerSelector } from "@/game/characters";
import { Chair, Computer, Whiteboard } from "@/game/objects";
import { Network } from "@/service";
import { eventEmitter } from "@/game/events";
import { JoystickMovement } from "@/components";
import { getJoystickDirection } from "@/utils";
import { store } from "@/stores";
import { showUserProfile } from "@/stores/modalSlice";
import { startNpcTalk } from "@/stores/aiSlice";
import { Game } from "@/game/scenes";
import {
  setUserName,
  setUserTexture,
  nextStatus,
  setUserStatus,
  setFollowing,
} from "@/stores/userSlice";

// Colyseus 서버의 기본 patch rate(50ms)와 동일 — 이보다 잦은 전송은 다른 클라이언트에 보이지 않는다
const SEND_INTERVAL_MS = 50;

// Shift를 누르고 이동하면 달리기 (기본 속도 200의 약 1.7배)
const SPRINT_SPEED = 340;

// 따라가기 거리: 이 안이면 멈추고(딱 겹치지 않게 살짝 뒤), 이보다 벌어지면 상대가 달려도
// 따라잡도록 뒷사람도 스프린트한다.
const FOLLOW_STOP_DISTANCE = 44;
const FOLLOW_SPRINT_DISTANCE = 130;
// 경로탐색이 없어 벽에 낄 수 있다. 체크포인트 대비 STALL_PROGRESS_PX 이상 못 움직인 채
// STALL_RELEASE_MS가 지나면 자동 해제한다. (프레임당이 아니라 "누적 진척"으로 판정 — 정상 이동 오판 방지)
const STALL_RELEASE_MS = 1500;
const STALL_PROGRESS_PX = 16;

export class LocalPlayer extends Player {
  containerBody: Phaser.Physics.Arcade.Body;
  facing: Direction = Direction.DOWN;
  activeChair?: Chair;
  speed = 200;
  isPhoneAnimating = false;
  private sendAccumulator = 0;
  private lastSent = { x: 0, y: 0, animKey: "" };

  keyE!: Phaser.Input.Keyboard.Key;
  keyR!: Phaser.Input.Keyboard.Key;
  keyF!: Phaser.Input.Keyboard.Key;
  keyESC!: Phaser.Input.Keyboard.Key;
  keySPACE!: Phaser.Input.Keyboard.Key;
  keyShift!: Phaser.Input.Keyboard.Key;
  joystickMovement?: JoystickMovement;
  joystickEPressed?: boolean;
  joystickRPressed?: boolean;

  // 따라가기 대상 sessionId. 이동은 아래 update의 velocity 블록에서 주입한다.
  followTargetId?: string;
  private stallTime = 0;
  private lastFollowPos = { x: 0, y: 0 };

  constructor(
    public scene: Game,
    id: string,
    x: number,
    y: number,
    texture: string,
  ) {
    super(scene, id, x, y, texture);
    this.containerBody = this.playerContainer.body as Phaser.Physics.Arcade.Body;
    this.registerKeys();
  }

  setPlayerName(name: string) {
    this.playerName.setText(name);
    store.dispatch(setUserName(name));
    eventEmitter.emit("UPDATE_PLAYER_NAME", name);
  }

  togglePlayerStatus() {
    const status = nextStatus(store.getState());
    store.dispatch(setUserStatus(status));
    eventEmitter.emit("UPDATE_PLAYER_STATUS", status);
    this.setPlayerStatus(status);
  }

  setPlayerAvatar(texture: string) {
    this.playerTexture = texture;
    this.anims.play(`${texture}_idle_down`, true);
    store.dispatch(setUserTexture(texture));
    eventEmitter.emit("UPDATE_PLAYER_TEXTURE", {
      x: this.x,
      y: this.y,
      animKey: this.anims.currentAnim!.key,
    });
  }

  setJoystickMovement(movement: JoystickMovement) {
    this.joystickMovement = movement;
  }

  private startFollow(id: string, name: string) {
    this.followTargetId = id;
    this.stallTime = 0;
    this.lastFollowPos = { x: this.x, y: this.y };
    store.dispatch(setFollowing({ id, name }));
  }

  // 따라가기 해제 — 수동 이동/대상 퇴장/정체/앉기 등에서 호출. HUD 인디케이터도 함께 끈다.
  stopFollow() {
    if (!this.followTargetId) return;
    this.followTargetId = undefined;
    store.dispatch(setFollowing(null));
  }

  registerKeys() {
    this.keyE = this.scene.input.keyboard!.addKey("E");
    this.keyR = this.scene.input.keyboard!.addKey("R");
    this.keyF = this.scene.input.keyboard!.addKey("F");
    this.keyESC = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.keySPACE = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.keyShift = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
    this.scene.input.keyboard!.disableGlobalCapture();

    eventEmitter.on("JOYSTICK_KEY_PRESSED", (key) => {
      if (key === "keyE") this.joystickEPressed = true;
      if (key === "keyR") this.joystickRPressed = true;
    });
  }

  // 앉기/펀치처럼 즉시 반영이 필요한 상태 전환용 (스로틀 무시)
  sendPlayerPosition(network: Network) {
    const animKey = this.anims.currentAnim!.key;
    this.lastSent = { x: this.x, y: this.y, animKey };
    this.sendAccumulator = 0;
    network.sendMessage("UPDATE_PLAYER", { x: this.x, y: this.y, animKey });
  }

  private throttledSendPlayerPosition(network: Network, delta: number) {
    this.sendAccumulator += delta;
    if (this.sendAccumulator < SEND_INTERVAL_MS) return;

    const animKey = this.anims.currentAnim!.key;
    const { x, y } = this;
    if (x === this.lastSent.x && y === this.lastSent.y && animKey === this.lastSent.animKey) {
      return;
    }
    this.sendPlayerPosition(network);
  }

  update(
    playerSelector: PlayerSelector,
    cursor: ExtendedCursorKeys,
    network: Network,
    delta: number,
  ) {
    const selectedItem = playerSelector.selectedItem;
    this.playerMarker.setPosition(this.x, this.y);

    const isEJustDown = Phaser.Input.Keyboard.JustDown(this.keyE) || this.joystickEPressed;
    const isRJustDown = Phaser.Input.Keyboard.JustDown(this.keyR) || this.joystickRPressed;
    const isFJustDown = Phaser.Input.Keyboard.JustDown(this.keyF);
    this.joystickEPressed = false;
    this.joystickRPressed = false;

    switch (this.playerBehavior) {
      case PlayerBehavior.IDLE: {
        const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(this.keySPACE);

        if (isEJustDown && selectedItem?.itemType === ItemType.CHAIR) {
          this.stopFollow();
          const chairObject = selectedItem as Chair;
          this.activeChair = chairObject;

          this.setVelocity(0, 0);
          this.containerBody.setVelocity(0, 0);

          this.scene.time.delayedCall(10, () => {
            const [offsetX, offsetY, offsetDepth] = sittingOffset[chairObject.direction];

            this.setPosition(chairObject.x + offsetX, chairObject.y + offsetY).setDepth(
              chairObject.depth + offsetDepth,
            );
            this.playerContainer.setPosition(
              chairObject.x + offsetX,
              chairObject.y + offsetY - this.height / 2,
            );

            this.anims.play(`${this.playerTexture}_sit_${chairObject.direction}`, true);
            playerSelector.selectedItem = undefined;
            playerSelector.setPosition(0, 0);
            this.sendPlayerPosition(network);
          });

          chairObject.clearDialogBox();
          chairObject.setDialogBox(["E: 일어나기"]);
          this.playerBehavior = PlayerBehavior.SITTING;
          return;
        }

        if (isRJustDown && selectedItem?.itemType === ItemType.COMPUTER) {
          const computerObject = selectedItem as Computer;
          computerObject.openDialog();
          return;
        }

        if (isRJustDown && selectedItem?.itemType === ItemType.WHITEBOARD) {
          const whiteboardObject = selectedItem as Whiteboard;
          whiteboardObject.openDialog();
          return;
        }

        if (isRJustDown && playerSelector.playerOverlap) {
          const otherPlayer = playerSelector.playerOverlap.player;
          if (otherPlayer.isNpc) {
            const busyBy = store.getState().ai.npcBusyBy;
            if (busyBy && busyBy !== this.playerId) {
              // 다른 사람이 대화 중 — 잠깐 안내만 (잠금은 서버가 관리)
              playerSelector.playerOverlap.setDialogBox(["다른 사람이 대화 중"]);
            } else {
              // 대화 시작 — 하단 전용 입력바가 뜨고 이동키가 잠긴다 (스마트폰 안 씀).
              // 대화 중엔 머리 위 "R: 말 걸기" 안내가 거슬리므로 지운다.
              store.dispatch(startNpcTalk());
              playerSelector.playerOverlap.clearDialogBox();
            }
          } else {
            store.dispatch(showUserProfile({ playerId: otherPlayer.playerId }));
          }
        }

        // F: 따라가기 토글 (NPC 제외). 같은 대상이면 해제.
        if (isFJustDown && playerSelector.playerOverlap) {
          const target = playerSelector.playerOverlap.player;
          if (!target.isNpc) {
            if (this.followTargetId === target.playerId) this.stopFollow();
            else this.startFollow(target.playerId, target.playerName.text);
          }
        }

        if (this.isPhoneAnimating) {
          this.stopFollow();
          this.anims.play(`${this.playerTexture}_phone_show`, true);
          this.playerBehavior = PlayerBehavior.PHONE;
          this.sendPlayerPosition(network);

          this.once(
            Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + `${this.playerTexture}_phone_show`,
            () => {
              this.anims.play(`${this.playerTexture}_phone_idle`, true);
              this.sendPlayerPosition(network);
            },
          );
          return;
        }

        if (isSpaceJustDown) {
          this.stopFollow();
          // 근처(KICK_RANGE)에 공이 있으면 "몸에서 밀어내는 방향"(내 위치 → 공)으로 찬다 →
          // 접근 각도에 따라 360° 자유 방향. 공은 즉시가 아니라 주먹이 뻗는 순간(KICK_DELAY_MS)에 나간다.
          const ball = this.scene.ball;
          if (ball && Phaser.Math.Distance.Between(this.x, this.y, ball.x, ball.y) < KICK_RANGE) {
            let dx = ball.x - this.x;
            let dy = ball.y - this.y;
            const len = Math.hypot(dx, dy);
            if (len < 1) {
              [dx, dy] = KICK_DIR[this.facing]; // 정확히 겹쳐 있으면 바라보는 방향으로 폴백
            } else {
              dx /= len;
              dy /= len;
            }
            // 펀치 애니가 공 나가는 쪽을 향하도록 facing 정렬
            if (Math.abs(dx) > Math.abs(dy)) {
              this.facing = dx > 0 ? Direction.RIGHT : Direction.LEFT;
            } else {
              this.facing = dy > 0 ? Direction.DOWN : Direction.UP;
            }
            this.scene.time.delayedCall(KICK_DELAY_MS, () => {
              ball.kick(dx * KICK_FORCE, dy * KICK_FORCE);
              network.sendMessage("KICK_BALL", { x: ball.x, y: ball.y });
            });
          }

          this.playerBehavior = PlayerBehavior.PUNCHING;
          this.anims.play(`${this.playerTexture}_punch_${this.facing}`, true);
          this.setVelocity(0, 0);
          this.containerBody.setVelocity(0, 0);
          this.sendPlayerPosition(network);

          this.once(
            Phaser.Animations.Events.ANIMATION_COMPLETE_KEY +
              `${this.playerTexture}_punch_${this.facing}`,
            () => {
              this.playerBehavior = PlayerBehavior.IDLE;
              this.anims.play(`${this.playerTexture}_idle_${this.facing}`, true);
              this.sendPlayerPosition(network);
            },
          );
          return;
        }

        let vx = 0;
        let vy = 0;
        const joystic = getJoystickDirection(this.joystickMovement);

        if (cursor.up.isDown || cursor.W.isDown || joystic.up) {
          vy -= this.speed;
          this.facing = Direction.UP;
        }
        if (cursor.down.isDown || cursor.S.isDown || joystic.down) {
          vy += this.speed;
          this.facing = Direction.DOWN;
        }
        if (cursor.left.isDown || cursor.A.isDown || joystic.left) {
          vx -= this.speed;
          this.facing = Direction.LEFT;
        }
        if (cursor.right.isDown || cursor.D.isDown || joystic.right) {
          vx += this.speed;
          this.facing = Direction.RIGHT;
        }

        // 따라가기: 수동 입력이 있으면 사용자 우선(해제), 없으면 대상 쪽으로 이동을 주입한다.
        let followSprint = false;
        if (this.followTargetId) {
          if (vx !== 0 || vy !== 0) {
            this.stopFollow();
          } else {
            const target = this.scene.otherPlayersMap.get(this.followTargetId);
            if (!target) {
              this.stopFollow(); // 대상 퇴장
            } else {
              const dx = target.x - this.x;
              const dy = target.y - this.y;
              const dist = Math.hypot(dx, dy);
              if (dist > FOLLOW_STOP_DISTANCE) {
                // 방향만 주면 아래 setLength가 실제 속도로 정규화한다
                vx = dx;
                vy = dy;
                followSprint = dist > FOLLOW_SPRINT_DISTANCE; // 멀어지면 달려서 따라잡는다
                if (Math.abs(dx) > Math.abs(dy)) {
                  this.facing = dx > 0 ? Direction.RIGHT : Direction.LEFT;
                } else {
                  this.facing = dy > 0 ? Direction.DOWN : Direction.UP;
                }
                // 정체 판정: 체크포인트 대비 충분히 움직였으면 진척으로 보고 리셋, 아니면 누적.
                // 벽에 낀 채 STALL_RELEASE_MS가 지나면 자동 해제(경로탐색이 없어 갇힐 수 있음).
                this.stallTime += delta;
                const progress = Math.hypot(
                  this.x - this.lastFollowPos.x,
                  this.y - this.lastFollowPos.y,
                );
                if (progress > STALL_PROGRESS_PX) {
                  this.stallTime = 0;
                  this.lastFollowPos = { x: this.x, y: this.y };
                }
                if (this.stallTime >= STALL_RELEASE_MS) this.stopFollow();
              } else {
                // 도달 → 정지(vx=vy=0 유지 → idle). 체크포인트도 갱신.
                this.stallTime = 0;
                this.lastFollowPos = { x: this.x, y: this.y };
              }
            }
          }
        }

        // Shift 또는 따라가기 추격 시 스프린트 (성분은 방향만, setLength가 실제 속도를 정함)
        const moveSpeed = this.keyShift.isDown || followSprint ? SPRINT_SPEED : this.speed;

        this.setDepth(this.y + this.height / 2);
        this.setVelocity(vx, vy);
        this.body!.velocity.setLength(moveSpeed);
        this.containerBody.setVelocity(vx, vy);
        this.containerBody.velocity.setLength(moveSpeed);

        if (vx > 0) {
          this.play(`${this.playerTexture}_run_right`, true);
        } else if (vx < 0) {
          this.play(`${this.playerTexture}_run_left`, true);
        } else if (vy > 0) {
          this.play(`${this.playerTexture}_run_down`, true);
        } else if (vy < 0) {
          this.play(`${this.playerTexture}_run_up`, true);
        } else {
          const animKey = `${this.playerTexture}_idle_${this.facing}`;

          if (this.anims.currentAnim?.key !== animKey) {
            this.play(animKey, true);
            this.sendPlayerPosition(network);
          }
        }
        if (vx !== 0 || vy !== 0) this.throttledSendPlayerPosition(network, delta);

        break;
      }
      case PlayerBehavior.SITTING: {
        if (isEJustDown) {
          this.joystickEPressed = false;
          const split = this.anims.currentAnim!.key.split("_");
          split[1] = "idle";
          this.anims.play(split.join("_"), true);
          this.facing = split[2] as Direction;
          this.playerBehavior = PlayerBehavior.IDLE;
          this.activeChair?.clearDialogBox();
          playerSelector.setPosition(this.x, this.y);
          this.sendPlayerPosition(network);
        }
        break;
      }
      case PlayerBehavior.PHONE: {
        const isESCJustDown = Phaser.Input.Keyboard.JustDown(this.keyESC);
        const joystic = getJoystickDirection(this.joystickMovement);
        if (
          isESCJustDown ||
          cursor.left.isDown ||
          cursor.right.isDown ||
          cursor.up.isDown ||
          cursor.down.isDown ||
          cursor.W.isDown ||
          cursor.A.isDown ||
          cursor.S.isDown ||
          cursor.D.isDown ||
          joystic.up ||
          joystic.down ||
          joystic.left ||
          joystic.right
        ) {
          this.playerBehavior = PlayerBehavior.IDLE;
          this.isPhoneAnimating = false;
          this.play(`${this.playerTexture}_idle_${this.facing}`, true);
          this.sendPlayerPosition(network);
        }
        break;
      }
      case PlayerBehavior.PUNCHING: {
        break;
      }
    }
  }
}
