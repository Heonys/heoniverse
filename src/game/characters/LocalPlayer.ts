import { Direction } from "@/constants";
import { Player } from "./Player";

export class LocalPlayer extends Player {
  facing: Direction = Direction.DOWN;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
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

    this.setVelocity(vx, vy);

    if (vx > 0) {
      this.play(`adam_run_right`, true);
    } else if (vx < 0) {
      this.play(`adam_run_left`, true);
    } else if (vy > 0) {
      this.play(`adam_run_down`, true);
    } else if (vy < 0) {
      this.play(`adam_run_up`, true);
    } else {
      const animKey = `adam_idle_${this.facing}`;

      if (this.anims.currentAnim?.key !== animKey) {
        this.play(animKey, true);
      }
    }
  }
}
