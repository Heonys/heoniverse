import { ItemType } from "@/constants";
import { Item } from "@/game/objects";
import { store } from "@/stores";
import { openComputerDialog } from "@/stores/computerSlice";

export class Computer extends Item {
  id!: string;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);

    this.itemType = ItemType.COMPUTER;
  }

  onOverlapDialog() {
    this.setDialogBox("R: 컴퓨터 사용하기");
  }

  openDialog() {
    store.dispatch(openComputerDialog({ id: this.id }));
  }
}
