import { PlayerBehavior } from "@/constants";

export class Player extends Phaser.Physics.Arcade.Sprite {
  playerId: string;
  playerTexture: string;
  playerContainer: Phaser.GameObjects.Container;
  playerName: Phaser.GameObjects.Text;
  playerBehavior = PlayerBehavior.IDLE;
  readyToConnect = false;

  // 채팅 버블 컨테이너에 포함

  constructor(scene: Phaser.Scene, id: string, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    this.playerId = id;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    this.playerTexture = texture;
    this.setDepth(this.y);

    this.anims.play(`${texture}_idle_down`);

    this.playerName = this.scene.add
      .text(0, 0, "")
      .setFontFamily("Retro")
      .setFontSize(12)
      .setColor("#000000")
      .setOrigin(0.5, 1);

    this.playerContainer = this.scene.add
      .container(this.x, this.y - this.height / 2, [this.playerName])
      .setDepth(5000);

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
}
