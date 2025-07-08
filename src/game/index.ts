import { Preloader, Background, Game } from "@/game/scenes";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "game-container",
  autoRound: true,
  autoFocus: true,
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.ScaleModes.ENVELOP,
    width: window.innerWidth,
    height: window.innerHeight,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
  scene: [Preloader, Background, Game],
};

export const phaserGame = new Phaser.Game(config);
