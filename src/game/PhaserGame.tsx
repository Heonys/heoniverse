import Phaser from "phaser";
import { forwardRef, useRef, useEffect, useLayoutEffect } from "react";
import { startGame } from "@/game/main";
import { eventEmitter } from "@/game/eventEmitter";

export type PhaserRef = {
  game: Phaser.Game | null;
  scene: Phaser.Scene | null;
};

export const PhaserGame = forwardRef<PhaserRef>((_, parentRef) => {
  const gameRef = useRef<Phaser.Game | null>(null);

  useLayoutEffect(() => {
    if (!gameRef.current) {
      gameRef.current = startGame("game-container");

      if (typeof parentRef === "function") {
        parentRef({ game: gameRef.current, scene: null });
      } else if (parentRef) {
        parentRef.current = { game: gameRef.current, scene: null };
      }
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [parentRef]);

  useEffect(() => {
    eventEmitter.on("current-scene-ready", (currentScene: Phaser.Scene) => {
      if (typeof parentRef === "function") {
        parentRef({ game: gameRef.current, scene: currentScene });
      } else if (parentRef) {
        parentRef.current = { game: gameRef.current, scene: currentScene };
      }
    });

    return () => {
      eventEmitter.removeListener("current-scene-ready");
    };
  }, [parentRef]);

  return <div id="game-container" />;
});
