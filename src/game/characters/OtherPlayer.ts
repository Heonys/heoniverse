import { Player } from "@/game/characters";

export class OtherPlayer extends Player {
  constructor(
    scene: Phaser.Scene,
    id: string,
    name: string,
    x: number,
    y: number,
    texture: string,
  ) {
    super(scene, id, x, y, texture);
  }
}
