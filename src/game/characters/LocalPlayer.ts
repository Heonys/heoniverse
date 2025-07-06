import { Direction } from "@/constants";
import { Player } from "./Player";

export class LocalPlayer extends Player {
  containerBody: Phaser.Physics.Arcade.Body;
  facing: Direction = Direction.DOWN;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    this.containerBody = this.playerContainer.body as Phaser.Physics.Arcade.Body;
  }

  update(cursor: Phaser.Types.Input.Keyboard.CursorKeys) {
    const speed = 200;
    let vx = 0;
    let vy = 0;

    if (cursor.left.isDown) {
      vx -= speed;
      this.facing = Direction.LEFT;
    }
    if (cursor.right.isDown) {
      vx += speed;
      this.facing = Direction.RIGHT;
    }
    if (cursor.up.isDown) {
      vy -= speed;
      this.facing = Direction.UP;
    }
    if (cursor.down.isDown) {
      vy += speed;
      this.facing = Direction.DOWN;
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
  }
}
