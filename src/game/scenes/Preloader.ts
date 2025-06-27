import Phaser from "phaser";

export class Preloader extends Phaser.Scene {
  constructor() {
    super("Preloader");
  }

  preload() {
    this.load.image("backdrop", "/images/background/backdrop_day.png");
    this.load.image("backdrop2", "/images/background/backdrop_sunrise.png");

    this.load.atlas(
      "cloud_day",
      "/images/background/cloud_day.png",
      "/images/background/cloud_day.json",
    );

    this.load.atlas(
      "cloud_night",
      "/images/background/cloud_night.png",
      "/images/background/cloud_night.json",
    );
  }

  create() {
    this.scene.start("Background");
  }
}
