export class Game extends Phaser.Scene {
  constructor() {
    super("Game");
  }

  create() {
    const sceneWidth = this.scale.height;
    const sceneHeight = this.scale.width;

    const backdropImage = this.add.image(sceneWidth / 2, sceneHeight / 2, "backdrop2");
    const scale = Math.max(sceneWidth / backdropImage.width, sceneHeight / backdropImage.height);
    backdropImage.setScale(scale);
  }
}
