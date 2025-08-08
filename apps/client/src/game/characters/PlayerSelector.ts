import { ExtendedCursorKeys, PlayerBehavior } from "@/constants/game";
import { LocalPlayer } from "@/game/characters";
import { Item } from "@/game/objects";
import { getJoystickDirection } from "@/utils";

export class PlayerSelector extends Phaser.GameObjects.Zone {
  selectedItem?: Item;

  constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
    super(scene, x, y, width, height);
    scene.physics.add.existing(this);
  }

  update(player: LocalPlayer, cursor: ExtendedCursorKeys) {
    if (!cursor) return;
    if (player.playerBehavior === PlayerBehavior.SITTING) return;

    const { x, y } = player;
    const joystic = getJoystickDirection(player.joystickMovement);

    if (cursor.left.isDown || joystic.left) {
      this.setPosition(x - 32, y);
    } else if (cursor.right.isDown || joystic.right) {
      this.setPosition(x + 32, y);
    } else if (cursor.up.isDown || joystic.up) {
      this.setPosition(x, y - 32);
    } else if (cursor.down.isDown || joystic.down) {
      this.setPosition(x, y + 32);
    }

    if (this.selectedItem) {
      if (!this.scene.physics.overlap(this, this.selectedItem)) {
        this.selectedItem.clearDialogBox();
        this.selectedItem = undefined;
      }
    }
  }
}
