import { useEffect } from "react";

export const useSceneEffect = (scene: Phaser.Scene, callback: () => void, depends: any[]) => {
  useEffect(() => {
    callback();

    scene.events.on("update", callback);
    return () => {
      scene.events.off("update", callback);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, depends);
};
