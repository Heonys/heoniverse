import { OtherPlayer } from "@/game/characters";
import { store } from "@/stores";
import type { Game } from "@/game/scenes";

export class PlayerOverlap extends Phaser.GameObjects.Zone {
  private dialogBox: Phaser.GameObjects.Container;

  constructor(
    scene: Phaser.Scene,
    public player: OtherPlayer,
    x: number,
    y: number,
    width: number,
    height: number,
  ) {
    super(scene, x, y, width, height);
    scene.physics.add.existing(this);
    this.dialogBox = this.scene.add.container().setDepth(9999);
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
    const dialogBoxY = this.y + 4 + this.height / 2;

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

  clearDialogBox() {
    this.dialogBox.removeAll(true);
  }

  onOverlapDialog() {
    if (this.player.isNpc) {
      // 내가 이미 대화 중이면 안내를 띄우지 않는다 (전용 입력바가 떠 있음)
      if (store.getState().ai.talking) {
        this.clearDialogBox();
        return;
      }
      const { npcBusyBy } = store.getState().ai;
      const localId = (this.scene as Game).localPlayer?.playerId;
      const busyByOther = npcBusyBy !== "" && npcBusyBy !== localId;
      this.setDialogBox([busyByOther ? "AI 도우미 (대화 중)" : "R: 말 걸기"]);
      return;
    }
    this.setDialogBox(["R: 프로필 보기"]);
  }
}
