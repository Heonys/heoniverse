import Phaser from "phaser";

export class Preloader extends Phaser.Scene {
  constructor() {
    super("Preloader");
  }

  preload() {
    this.load.image("backdrop", "/images/background/backdrop_day.png");
  }

  create() {
    this.scene.start("Background");
  }
}
