export class PlayerOverlap extends Phaser.GameObjects.Zone {
  private dialogBox: Phaser.GameObjects.Container;

  constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
    super(scene, x, y, width, height);
    scene.physics.add.existing(this);

    this.dialogBox = this.scene.add.container().setDepth(9999);
  }

  setDialogBox(message: string) {
    const innerText = this.scene.add
      .text(0, 0, message)
      .setFontFamily("Retro")
      .setFontSize(12)
      .setColor("#000000");

    const dialogBoxWidth = innerText.width + 3;
    const dialogBoxHeight = innerText.height + 1;
    const dialogBoxX = this.x - dialogBoxWidth / 2;
    const dialogBoxY = this.y + this.height / 2;

    innerText.setPosition(dialogBoxX + 2, dialogBoxY);

    const box = this.scene.add
      .graphics()
      .fillStyle(0xffffff, 1)
      .fillRoundedRect(dialogBoxX, dialogBoxY, dialogBoxWidth, dialogBoxHeight, 3)
      .lineStyle(1.5, 0x000000, 1)
      .strokeRoundedRect(dialogBoxX, dialogBoxY, dialogBoxWidth, dialogBoxHeight, 3);

    this.dialogBox.add([box, innerText]);
  }

  clearDialogBox() {
    this.dialogBox.removeAll(true);
  }

  onOverlapDialog() {
    this.setDialogBox("E: 프로필 보기");
  }
}
