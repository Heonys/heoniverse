import { store } from "@/stores";
import { setRoomJoined } from "@/stores/roomSlice";
import Phaser from "phaser";

export class Preloader extends Phaser.Scene {
  private preloadComplete = false;

  constructor() {
    super("preloader");
  }

  preload() {
    this.load.image("backdrop", "/images/background/backdrop_day.png");

    this.load.tilemapTiledJSON("tilemap", "/images/map/tilemap.tmj");

    this.load.spritesheet("tileset_wall", "/images/map/FloorAndGround.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("tileset_chairs", "/images/objects/chair.png", {
      frameWidth: 32,
      frameHeight: 64,
    });
    this.load.spritesheet("tileset_computers", "/images/objects/computer.png", {
      frameWidth: 96,
      frameHeight: 64,
    });
    this.load.spritesheet("tileset_whiteboards", "/images/objects/whiteboard.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet("tileset_vendingmachines", "/images/objects/vendingmachine.png", {
      frameWidth: 48,
      frameHeight: 72,
    });
    this.load.spritesheet("tileset_office", "/images/tileset/Modern_Office_Black_Shadow.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("tileset_basement", "/images/tileset/Basement.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("tileset_generic", "/images/tileset/Generic.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("adam", "/images/character/adam.png", {
      frameWidth: 32,
      frameHeight: 48,
    });

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

    this.load.on("complete", () => {
      this.preloadComplete = true;
      this.scene.launch("background");
    });
  }

  launchGame() {
    if (!this.preloadComplete) return;
    this.scene.launch("game");
    store.dispatch(setRoomJoined(true));
  }
}
