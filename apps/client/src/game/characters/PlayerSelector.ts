import { PlayerBehavior } from "@/constants";
import { LocalPlayer } from "@/game/characters";
import { Item } from "@/game/objects";

export class PlayerSelector extends Phaser.GameObjects.Zone {
  selectedItem?: Item;

  constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
    super(scene, x, y, width, height);

    scene.physics.add.existing(this);
  }

  update(player: LocalPlayer, cursor: Phaser.Types.Input.Keyboard.CursorKeys) {
    if (!cursor) return;
    if (player.playerBehavior === PlayerBehavior.SITTING) return;

    const { x, y } = player;

    if (cursor.left.isDown) {
      this.setPosition(x - 32, y);
    } else if (cursor.right.isDown) {
      this.setPosition(x + 32, y);
    } else if (cursor.up.isDown) {
      this.setPosition(x, y - 32);
    } else if (cursor.down.isDown) {
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
