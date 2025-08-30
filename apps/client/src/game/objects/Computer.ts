import { ItemType } from "@/constants/game";
import { Item } from "@/game/objects";
import { store } from "@/stores";
import { openComputerDialog } from "@/stores/computerSlice";

export class Computer extends Item {
  id!: string;
  connectedUsers = new Set<string>();

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);
    this.itemType = ItemType.COMPUTER;
  }

  updateStatusBox() {
    this.closeStatusBox();
    const size = this.connectedUsers.size;
    if (size > 0) {
      this.openStatusBox(`${size}명 접속중`);
    }
  }

  connected(userId: string) {
    if (this.connectedUsers.has(userId)) return;
    this.connectedUsers.add(userId);
    this.updateStatusBox();
  }

  disConnected(userId: string) {
    if (!this.connectedUsers.has(userId)) return;
    this.connectedUsers.delete(userId);
    this.updateStatusBox();
  }

  onOverlapDialog() {
    this.setDialogBox(["E: 컴퓨터 사용하기"]);
  }

  openDialog() {
    store.dispatch(openComputerDialog({ id: this.id }));
  }
}
