import Phaser from "phaser";
import { Network } from "@/service";
import { store } from "@/stores";
import { setRoomJoined } from "@/stores/roomSlice";

export class Preloader extends Phaser.Scene {
  private preloadComplete = false;
  network!: Network;

  constructor() {
    super("preloader");
  }

  init() {
    this.network = new Network();
  }

  preload() {
    this.load.image("backdrop", "/images/background/backdrop_day.png");
    this.load.image("call", "/icons/call.png");

    this.load.tilemapTiledJSON("tilemap", "/images/map/tilemap.tmj");

    //

    this.load.spritesheet("tileset_wall_3d", "/images/tileset/Wall_3d.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("tileset_1x2", "/images/tileset/object1x2.png", {
      frameWidth: 32,
      frameHeight: 64,
    });

    this.load.spritesheet("tileset_1x3", "/images/tileset/object1x3.png", {
      frameWidth: 32,
      frameHeight: 96,
    });

    this.load.spritesheet("tileset_2x2", "/images/tileset/object2x2.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.spritesheet("tileset_3x2", "/images/tileset/object3x2.png", {
      frameWidth: 96,
      frameHeight: 64,
    });

    //
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
    this.load.spritesheet("tileset_office", "/images/tileset/Office.png", {
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

    this.load.spritesheet("tileset_jail", "/images/tileset/Jail.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("tileset_kitchen", "/images/tileset/Kitchen.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("tileset_hospital", "/images/tileset/Hospital.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("suit", "/images/character/entire/suit.png", {
      frameWidth: 32,
      frameHeight: 64,
    });

    this.load.spritesheet("kimono", "/images/character/entire/kimono.png", {
      frameWidth: 32,
      frameHeight: 64,
    });

    this.load.spritesheet("bald", "/images/character/entire/bald.png", {
      frameWidth: 32,
      frameHeight: 64,
    });
    this.load.spritesheet("ghost", "/images/character/entire/ghost.png", {
      frameWidth: 32,
      frameHeight: 64,
    });
    this.load.spritesheet("jobless", "/images/character/entire/jobless.png", {
      frameWidth: 32,
      frameHeight: 64,
    });
    this.load.spritesheet("police", "/images/character/entire/police.png", {
      frameWidth: 32,
      frameHeight: 64,
    });
    this.load.spritesheet("rapper", "/images/character/entire/rapper.png", {
      frameWidth: 32,
      frameHeight: 64,
    });
    this.load.spritesheet("shark", "/images/character/entire/shark.png", {
      frameWidth: 32,
      frameHeight: 64,
    });
    this.load.spritesheet("doctor", "/images/character/entire/doctor.png", {
      frameWidth: 32,
      frameHeight: 64,
    });

    this.load.atlas(
      "cloud_day",
      "/images/background/cloud_day.png",
      "/images/background/cloud_day.json",
    );

    this.load.on("complete", () => {
      this.preloadComplete = true;
      this.scene.launch("background");
    });
  }

  launchGame() {
    if (!this.preloadComplete) return;
    this.scene.launch("game", { network: this.network });
    store.dispatch(setRoomJoined(true));
  }
}
