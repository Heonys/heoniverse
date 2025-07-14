import { Direction, ItemType, PlayerBehavior, sittingOffset } from "@/constants";
import { Player, PlayerSelector } from "@/game/characters";
import { Chair, Computer, Whiteboard } from "@/game/objects";

export class LocalPlayer extends Player {
  containerBody: Phaser.Physics.Arcade.Body;
  facing: Direction = Direction.DOWN;
  activeChair?: Chair;

  keyE!: Phaser.Input.Keyboard.Key;
  keyR!: Phaser.Input.Keyboard.Key;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    this.containerBody = this.playerContainer.body as Phaser.Physics.Arcade.Body;
    this.registerKeys();
  }

  setPlayerName(name: string) {
    this.playerName.setText(name);
  }

  setPlayerAvatar(texture: string) {
    this.playerTexture = texture;
    this.anims.play(`${this.playerTexture}_idle_down`, true);
  }

  registerKeys() {
    this.keyE = this.scene.input.keyboard!.addKey("E");
    this.keyR = this.scene.input.keyboard!.addKey("R");
    this.scene.input.keyboard!.disableGlobalCapture();
  }

  update(playerSelector: PlayerSelector, cursor: Phaser.Types.Input.Keyboard.CursorKeys) {
    const selectedItem = playerSelector.selectedItem;

    if (Phaser.Input.Keyboard.JustDown(this.keyR)) {
      switch (selectedItem?.itemType) {
        case ItemType.COMPUTER: {
          const computerObject = selectedItem as Computer;
          computerObject.openDialog();
          break;
        }
        case ItemType.WHITEBOARD: {
          const computerObject = selectedItem as Whiteboard;
          computerObject.openDialog();
          break;
        }
      }
    }

    switch (this.playerBehavior) {
      case PlayerBehavior.IDLE: {
        if (
          Phaser.Input.Keyboard.JustDown(this.keyE) &&
          selectedItem?.itemType === ItemType.CHAIR
        ) {
          const chairObject = selectedItem as Chair;
          this.activeChair = chairObject;

          this.setVelocity(0, 0);
          this.containerBody.setVelocity(0, 0);

          this.scene.time.delayedCall(10, () => {
            const [offsetX, offsetY, offsetDepth] = sittingOffset[chairObject.direction];

            this.setPosition(chairObject.x + offsetX, chairObject.y + offsetY).setDepth(
              chairObject.depth + offsetDepth,
            );
            this.playerContainer.setPosition(chairObject.x, chairObject.y - this.height / 2);

            this.anims.play(`${this.playerTexture}_sit_${chairObject.direction}`, true);
            playerSelector.selectedItem = undefined;
            playerSelector.setPosition(0, 0);
          });

          chairObject.clearDialogBox();
          chairObject.setDialogBox("E: 일어나기");
          this.playerBehavior = PlayerBehavior.SITTING;
          return;
        }

        const speed = 200;
        let vx = 0;
        let vy = 0;

        if (cursor.up.isDown) {
          vy -= speed;
          this.facing = Direction.UP;
        }
        if (cursor.down.isDown) {
          vy += speed;
          this.facing = Direction.DOWN;
        }
        if (cursor.left.isDown) {
          vx -= speed;
          this.facing = Direction.LEFT;
        }
        if (cursor.right.isDown) {
          vx += speed;
          this.facing = Direction.RIGHT;
        }

        this.setDepth(this.y);
        this.setVelocity(vx, vy);
        this.containerBody.setVelocity(vx, vy);

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
          }
        }
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
        }
        break;
      }
    }
  }
}
