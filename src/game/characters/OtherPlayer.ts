import { Player } from "@/game/characters";
import { IPlayer } from "@server/src/types";

export class OtherPlayer extends Player {
  containerBody: Phaser.Physics.Arcade.Body;

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
    this.containerBody = this.playerContainer.body as Phaser.Physics.Arcade.Body;
  }

  updatePlayer(player: IPlayer) {
    console.log(player.x, player.y);
  }

  protected preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
  }
}
