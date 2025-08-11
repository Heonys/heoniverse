import { Player, PlayerOverlap } from "@/game/characters";
import { spliteAnimKey } from "@/utils";
import { IPlayer } from "@heoniverse/shared";

export class OtherPlayer extends Player {
  playerOverlap: PlayerOverlap;
  containerBody: Phaser.Physics.Arcade.Body;
  destination = { x: 0, y: 0 };
  speed = 200;

  constructor(
    scene: Phaser.Scene,
    id: string,
    name: string,
    x: number,
    y: number,
    texture: string,
  ) {
    super(scene, id, x, y, texture);
    this.playerName.setText(name);
    this.destination = { x, y };
    this.containerBody = this.playerContainer.body as Phaser.Physics.Arcade.Body;
    this.playerOverlap = new PlayerOverlap(scene, this, x, y, this.width, this.height);
    scene.physics.add.existing(this.playerOverlap);
  }

  updatePlayer(player: IPlayer) {
    const { name, x, y, readyToConnect, animKey } = player;
    this.playerName.setText(name);
    this.destination = { x, y };
    this.readyToConnect = readyToConnect;
    this.anims.play(animKey, true);
  }

  protected preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    this.playerOverlap.setPosition(this.x, this.y);

    if (delta > 500) {
      this.setPosition(this.destination.x, this.destination.y);
      this.playerContainer.setPosition(this.destination.x, this.destination.y - this.height / 2);
      return;
    }

    const distance = (this.speed / 1000) * delta;
    let dx = this.destination.x - this.x;
    let dy = this.destination.y - this.y;

    if (Math.abs(dx) < distance) {
      this.x = this.destination.x;
      this.playerContainer.x = this.destination.x;
      dx = 0;
    }
    if (Math.abs(dy) < distance) {
      this.y = this.destination.y;
      this.playerContainer.y = this.destination.y - this.height / 2;
      dy = 0;
    }

    const vx = Math.sign(dx) * this.speed;
    const vy = Math.sign(dy) * this.speed;

    this.setVelocity(vx, vy);
    this.body!.velocity.setLength(this.speed);
    this.containerBody.setVelocity(vx, vy);
    this.containerBody.velocity.setLength(this.speed);

    this.setDepth(this.y);
    const { character, state, sittingOffset } = spliteAnimKey(this.anims.currentAnim!.key);
    this.playerTexture = character;
    if (state === "sit") {
      if (sittingOffset) {
        this.setDepth(this.y + sittingOffset[2]);
      }
    }
  }
  destroy(fromScene?: boolean) {
    this.playerContainer.destroy();
    super.destroy(fromScene);
  }
}
