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
import { Game } from "@/game/scenes";
import { setUserName, setUserTexture, nextStatus, setUserStatus } from "@/stores/userSlice";

export class LocalPlayer extends Player {
  containerBody: Phaser.Physics.Arcade.Body;
  facing: Direction = Direction.DOWN;
  activeChair?: Chair;
  speed = 200;
  isPhoneAnimating = false;

  keyE!: Phaser.Input.Keyboard.Key;
  keyR!: Phaser.Input.Keyboard.Key;
  keyESC!: Phaser.Input.Keyboard.Key;
  keySPACE!: Phaser.Input.Keyboard.Key;
  joystickMovement?: JoystickMovement;

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
  }

  sendPlayerPosition(network: Network) {
    network.sendMessage("UPDATE_PLAYER", {
      x: this.x,
      y: this.y,
      animKey: this.anims.currentAnim!.key,
    });
  }

  update(playerSelector: PlayerSelector, cursor: ExtendedCursorKeys, network: Network) {
    const selectedItem = playerSelector.selectedItem;
    this.playerMarker.setPosition(this.x, this.y);

    switch (this.playerBehavior) {
      case PlayerBehavior.IDLE: {
        const isEJustDown = Phaser.Input.Keyboard.JustDown(this.keyE);
        const isRJustDown = Phaser.Input.Keyboard.JustDown(this.keyR);
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
          store.dispatch(showUserProfile({ otherPlayer }));
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
        if (vx !== 0 || vy !== 0) this.sendPlayerPosition(network);

        break;
      }
      case PlayerBehavior.SITTING: {
        if (Phaser.Input.Keyboard.JustDown(this.keyE)) {
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
