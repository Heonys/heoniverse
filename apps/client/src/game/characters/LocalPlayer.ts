import {
  Direction,
  ExtendedCursorKeys,
  ItemType,
  PlayerBehavior,
  sittingOffset,
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
import { setUserName, setUserTexture, nextStatus, setUserStatus } from "@/stores/userSlice";

// Colyseus 서버의 기본 patch rate(50ms)와 동일 — 이보다 잦은 전송은 다른 클라이언트에 보이지 않는다
const SEND_INTERVAL_MS = 50;

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
  keyESC!: Phaser.Input.Keyboard.Key;
  keySPACE!: Phaser.Input.Keyboard.Key;
  joystickMovement?: JoystickMovement;
  joystickEPressed?: boolean;
  joystickRPressed?: boolean;

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

  registerKeys() {
    this.keyE = this.scene.input.keyboard!.addKey("E");
    this.keyR = this.scene.input.keyboard!.addKey("R");
    this.keyESC = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.keySPACE = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
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
    this.joystickEPressed = false;
    this.joystickRPressed = false;

    switch (this.playerBehavior) {
      case PlayerBehavior.IDLE: {
        const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(this.keySPACE);

        if (isEJustDown && selectedItem?.itemType === ItemType.CHAIR) {
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

        if (this.isPhoneAnimating) {
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

        this.setDepth(this.y + this.height / 2);
        this.setVelocity(vx, vy);
        this.body!.velocity.setLength(this.speed);
        this.containerBody.setVelocity(vx, vy);
        this.containerBody.velocity.setLength(this.speed);

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
