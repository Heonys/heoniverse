export class Background extends Phaser.Scene {
  cloud!: Phaser.Physics.Arcade.Group;

  constructor() {
    super("background");
  }

  create() {
    const sceneWidth = this.scale.width;
    const sceneHeight = this.scale.height;

    const backdropImage = this.add.image(sceneWidth / 2, sceneHeight / 2, "backdrop");
    const scale = Math.max(sceneWidth / backdropImage.width, sceneHeight / backdropImage.height);
    backdropImage.setScale(scale);

    // this.cloud = this.physics.add.group();
    // const frames = this.textures.get("cloud_day").getFrameNames();

    // for (let i = 0; i < 24; i++) {
    //   const x = Phaser.Math.RND.between(-sceneWidth * 0.5, sceneWidth * 1.5);
    //   const y = Phaser.Math.RND.between(sceneHeight * 0.2, sceneHeight * 0.8);
    //   const velocity = Phaser.Math.RND.between(15, 30);

    //   this.cloud
    //     .get(x, y, "cloud_day", frames[i % 6])
    //     .setScale(3)
    //     .setVelocity(velocity, 0);
    // }
  }
}
