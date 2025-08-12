import { Preloader, Background, Game } from "@/game/scenes";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "game-container",
  backgroundColor: "#9dd2f5",
  autoRound: true,
  autoFocus: true,
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.ScaleModes.RESIZE,
    width: window.innerWidth,
    height: window.innerHeight,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  scene: [Preloader, Background, Game],
};

export const phaserGame = new Phaser.Game(config);
