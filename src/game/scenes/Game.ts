export class Game extends Phaser.Scene {
  private cursor!: Phaser.Types.Input.Keyboard.CursorKeys;
  private map!: Phaser.Tilemaps.Tilemap;

  constructor() {
    super("game");
  }

  create() {
    this.cursor = this.input.keyboard!.createCursorKeys();
    this.map = this.make.tilemap({ key: "tilemap" });

    const floorAndGroundTileset = this.map.addTilesetImage("FloorAndGround", "tiles_wall")!;
    const colliderLayer = this.map.createLayer("Ground", floorAndGroundTileset)!;
    colliderLayer.setCollisionByProperty({ collides: true });

    // this.addGroupFromTiled("Wall", "tiles_wall", "FloorAndGround", false);
  }
}
