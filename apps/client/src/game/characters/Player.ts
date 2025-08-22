import { PlayerBehavior } from "@/constants/game";
import { Game } from "@/game/scenes";
import { Status } from "@heoniverse/shared";

export class Player extends Phaser.Physics.Arcade.Sprite {
  playerId: string;
  playerTexture: string;
  playerContainer: Phaser.GameObjects.Container;
  playerBubble: Phaser.GameObjects.Container;
  playerName: Phaser.GameObjects.Text;
  playerBehavior = PlayerBehavior.IDLE;
  playerMarker: Phaser.GameObjects.Arc;
  playerStatus: Status = "available";
  statusCircle: Phaser.GameObjects.Arc;

  readyToConnect = false;
  mediaConnect = false;
  videoEnabled = true;
  micEnabled = true;
  readyToStream = false;

  constructor(
    public scene: Game,
    id: string,
    x: number,
    y: number,
    texture: string,
  ) {
    super(scene, x, y, texture);

    this.playerId = id;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    this.playerTexture = texture;
    this.setDepth(this.y);
    this.anims.play(`${texture}_idle_down`);

    this.playerMarker = this.scene.add.circle(this.x, this.y, 25, 0x00ff00, 1).setDepth(999);
    this.scene.cameras.main.ignore([this.playerMarker]);
    this.playerBubble = this.scene.add.container(0, 0).setDepth(9999);
    this.playerName = this.scene.add
      .text(0, 0, "")
      .setFontFamily("Retro")
      .setFontSize(12)
      .setColor("#000000")
      .setOrigin(0.5, 1);

    this.statusCircle = this.scene.add
      .circle(0, 2, 5, 0x01dca2)
      .setStrokeStyle(1.5, 0x000000, 1)
      .setOrigin(0.5, 1)
      .setPosition(0, -this.playerName.height - 1);

    this.playerContainer = this.scene.add
      .container(this.x, this.y - this.height / 2, [
        this.playerName,
        this.statusCircle,
        this.playerBubble,
      ])
      .setDepth(9999);

    this.scene.physics.world.enable(this.playerContainer);

    const collisionScale = [0.5, 0.2];
    const playContainerBody = this.playerContainer.body as Phaser.Physics.Arcade.Body;
    const spriteBody = this.body as Phaser.Physics.Arcade.Body;

    playContainerBody
      .setSize(this.width * collisionScale[0], this.height * collisionScale[1])
      .setOffset(-this.width / 4, this.height * (1 - collisionScale[1]));

    spriteBody
      .setSize(this.width * collisionScale[0], this.height * collisionScale[1])
      .setOffset(this.width * (1 - collisionScale[0]) * 0.5, this.height * (1 - collisionScale[1]));
  }

  setupMinimap() {
    if (this.scene.minimap) {
      this.scene.minimap.ignore([this, this.playerContainer]);
    }
  }

  openBubble(message: string) {
    this.closeBubble();

    const filtered = message.length <= 50 ? message : message.slice(0, 50).concat("...");

    const innerText = this.scene.add
      .text(0, 0, filtered, { wordWrap: { width: 165, useAdvancedWrap: true } })
      .setFontFamily("Retro")
      .setFontSize(12)
      .setColor("#000000")
      .setOrigin(0.5);

    innerText.setY(-(innerText.height / 2) - this.playerName.height - 2);

    const boxWidth = innerText.width + 8;
    const boxHeight = innerText.height + 3;
    const boxX = innerText.x - boxWidth / 2;
    const boxY = innerText.y - boxHeight / 2;

    const box = this.scene.add
      .graphics()
      .fillStyle(0xffffff, 1)
      .fillRoundedRect(boxX, boxY, boxWidth, boxHeight, 3)
      .lineStyle(1.5, 0x000000, 1)
      .strokeRoundedRect(boxX, boxY, boxWidth, boxHeight, 3);

    this.playerBubble.add([box, innerText]);

    this.scene.time.delayedCall(3500, () => {
      this.closeBubble();
    });
  }

  closeBubble() {
    this.playerBubble.removeAll(true);
  }

  setPlayerStatus(status: Status) {
    this.playerStatus = status;
    switch (status) {
      case "available": {
        return this.statusCircle.setFillStyle(0x01dca2);
      }
      case "busy": {
        return this.statusCircle.setFillStyle(0xfbd359);
      }
      case "focused": {
        return this.statusCircle.setFillStyle(0xe25156);
      }
    }
  }
}
