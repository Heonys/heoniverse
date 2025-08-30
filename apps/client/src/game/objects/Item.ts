import { ItemType } from "@/constants/game";

export class Item extends Phaser.Physics.Arcade.Sprite {
  private dialogBox: Phaser.GameObjects.Container;
  private playerStatusBox: Phaser.GameObjects.Container;
  itemType!: ItemType;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);

    this.dialogBox = this.scene.add.container().setDepth(9999);
    this.playerStatusBox = this.scene.add.container().setDepth(9999);
  }

  setDialogBox(messages: string[]) {
    this.clearDialogBox();

    const paddingX = 4;
    const paddingY = 4;
    const lineSpacing = 1;

    const textObjects = messages.map((msg, index) => {
      const textObj = this.scene.add
        .text(0, 0, msg)
        .setFontFamily("Retro")
        .setFontSize(12)
        .setColor("#000000");

      textObj.setY(index * (textObj.height + lineSpacing));
      return textObj;
    });

    const maxWidth = Math.max(...textObjects.map((it) => it.width));
    const totalHeight =
      textObjects.reduce((acc, cur) => acc + cur.height, 0) + (messages.length - 1) * lineSpacing;

    const dialogBoxX = this.x - maxWidth / 2 - paddingX / 2;
    const dialogBoxY = this.y + this.height / 2;

    const box = this.scene.add
      .graphics()
      .fillStyle(0xffffff, 1)
      .fillRoundedRect(dialogBoxX, dialogBoxY, maxWidth + paddingX, totalHeight + paddingY, 3)
      .lineStyle(1.5, 0x000000, 1)
      .strokeRoundedRect(dialogBoxX, dialogBoxY, maxWidth + paddingX, totalHeight + paddingY, 3);

    textObjects.forEach((textObj) => {
      textObj.setX(dialogBoxX + paddingX / 2);
      textObj.setY(dialogBoxY + paddingY / 2 + textObj.y);
    });

    this.dialogBox.add([box, ...textObjects]);
  }

  onOverlapDialog() {
    throw new Error("must be implemented");
  }

  clearDialogBox() {
    this.dialogBox.removeAll(true);
  }

  openStatusBox(text: string) {
    const innerText = this.scene.add
      .text(0, 0, text)
      .setFontFamily("Retro")
      .setFontSize(12)
      .setColor("#000000");

    const statusBoxWidth = innerText.width + 4;
    const statusBoxHeight = innerText.height + 2;
    const statusBoxX = this.x - statusBoxWidth * 0.5;
    const statusBoxY = this.y - this.height * 0.25;

    const box = this.scene.add
      .graphics()
      .fillStyle(0xffffff, 1)
      .fillRoundedRect(statusBoxX, statusBoxY, statusBoxWidth, statusBoxHeight, 3)
      .lineStyle(1.5, 0x000000, 1)
      .strokeRoundedRect(statusBoxX, statusBoxY, statusBoxWidth, statusBoxHeight, 3);

    this.playerStatusBox.add([box, innerText.setPosition(statusBoxX + 2, statusBoxY)]);
  }

  closeStatusBox() {
    this.playerStatusBox.removeAll(true);
  }
}
