import Phaser from "phaser";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  pixelArt: true,
  scale: {
    // mode: Phaser.Scale.FIT,
    // autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1024,
    height: 600,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
};

export const startGame = (parent: string) => {
  return new Phaser.Game({ ...config, parent });
};
