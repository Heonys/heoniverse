import { ItemType } from "@/constants/game";
import { Item } from "@/game/objects";
import { store } from "@/stores";
import { openWhiteboardDialog } from "@/stores/whiteboardSlice";

export class Whiteboard extends Item {
  id!: string;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);

    this.itemType = ItemType.WHITEBOARD;
  }

  onOverlapDialog() {
    this.setDialogBox("R: 화이트보드 사용하기");
  }

  openDialog() {
    store.dispatch(openWhiteboardDialog({ id: this.id }));
  }
}
