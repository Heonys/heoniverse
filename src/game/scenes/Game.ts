import { createCharacterAnims } from "@/game/anims/CharacterAnims";
import { LocalPlayer } from "@/game/characters";

export class Game extends Phaser.Scene {
  private cursor!: Phaser.Types.Input.Keyboard.CursorKeys;
  private map!: Phaser.Tilemaps.Tilemap;
  localPlayer!: LocalPlayer;

  constructor() {
    super("game");
  }

  create() {
    this.cursor = this.input.keyboard!.createCursorKeys();
    this.map = this.make.tilemap({ key: "tilemap" });
    createCharacterAnims(this.anims);

    const floorAndGroundTileset = this.map.addTilesetImage("FloorAndGround", "tiles_wall")!;
    const groundLayer = this.map.createLayer("Ground", floorAndGroundTileset)!;
    groundLayer.setCollisionByProperty({ collides: true });

    this.addGroupFromTiled("Wall", "tiles_wall", "FloorAndGround", false);

    this.localPlayer = new LocalPlayer(this, 705, 500, "adam");
    this.physics.add.collider([this.localPlayer, this.localPlayer.playerContainer], groundLayer);

    this.setupCamera(this.localPlayer);
  }

  setupCamera(object: Phaser.Physics.Arcade.Sprite) {
    this.cameras.main.setZoom(1.5);
    this.cameras.main.startFollow(object);
  }

  update(_time: number, _delta: number) {
    if (this.localPlayer) {
      this.localPlayer.update(this.cursor);
    }
  }

  private addGroupFromTiled(
    objectLayerName: string,
    key: string,
    tilesetName: string,
    collidable: boolean,
  ) {
    const group = this.physics.add.staticGroup();
    const objectLayer = this.map.getObjectLayer(objectLayerName)!;

    objectLayer.objects.forEach((object) => {
      const actualX = object.x! + object.width! * 0.5;
      const actualY = object.y! - object.height! * 0.5;
      group
        .get(actualX, actualY, key, object.gid! - this.map.getTileset(tilesetName)!.firstgid)
        .setDepth(actualY);
    });
    if (this.localPlayer && collidable) {
      this.physics.add.collider([this.localPlayer, this.localPlayer.playerContainer], group);
    }
  }
}
