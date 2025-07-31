import { Direction, ItemType } from "@/constants/game";
import { Item } from "@/game/objects";

export class Chair extends Item {
  direction!: Direction;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);

    this.itemType = ItemType.CHAIR;
  }

  onOverlapDialog() {
    this.setDialogBox("E: 앉기");
  }
}
