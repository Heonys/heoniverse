import { ItemType } from "@/constants";
import { Item } from "@/game/objects";

export class Computer extends Item {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);

    this.itemType = ItemType.COMPUTER;
  }
}
