export class Background extends Phaser.Scene {
  constructor() {
    super("Background");
  }

  create() {
    const sceneWidth = this.scale.height;
    const sceneHeight = this.scale.width;

    const backdropImage = this.add.image(sceneWidth / 2, sceneHeight / 2, "backdrop");
    const scale = Math.max(sceneWidth / backdropImage.width, sceneHeight / backdropImage.height);
    backdropImage.setScale(scale).setScrollFactor(0);
  }
}
