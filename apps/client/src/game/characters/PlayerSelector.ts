import { ExtendedCursorKeys, PlayerBehavior } from "@/constants/game";
import { LocalPlayer, PlayerOverlap } from "@/game/characters";
import { Item } from "@/game/objects";
import { getJoystickDirection } from "@/utils";

export class PlayerSelector extends Phaser.GameObjects.Zone {
  selectedItem?: Item;
  playerOverlap?: PlayerOverlap;

  constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
    super(scene, x, y, width, height);
    scene.physics.add.existing(this);
  }

  update(player: LocalPlayer, cursor: ExtendedCursorKeys) {
    if (!cursor) return;
    if (player.playerBehavior === PlayerBehavior.SITTING) return;

    const { x, y } = player;
    const joystic = getJoystickDirection(player.joystickMovement);

    if (cursor.left.isDown || cursor.A.isDown || joystic.left) {
      this.setPosition(x - 32, y);
    } else if (cursor.right.isDown || cursor.D.isDown || joystic.right) {
      this.setPosition(x + 32, y);
    } else if (cursor.up.isDown || cursor.W.isDown || joystic.up) {
      this.setPosition(x, y - 32);
    } else if (cursor.down.isDown || cursor.S.isDown || joystic.down) {
      this.setPosition(x, y + 32);
    }

    if (this.selectedItem) {
      if (!this.scene.physics.overlap(this, this.selectedItem)) {
        this.selectedItem.clearDialogBox();
        this.selectedItem = undefined;
      }
    }

    if (this.playerOverlap) {
      if (!this.scene.physics.overlap(this, this.playerOverlap)) {
        this.playerOverlap.clearDialogBox();
        this.playerOverlap = undefined;
      }
    }
  }
}
