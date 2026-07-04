import { phaserGame } from "@/game";
import { Game, Preloader } from "@/game/scenes";
import { useMemo } from "react";

export const useGame = () => {
  const preloader = useMemo(() => phaserGame.scene.keys.preloader as Preloader, []);
  const game = useMemo(() => phaserGame.scene.keys.game as Game, []);

  const isConnectedPlayer = (id: string) => {
    if (!game.otherPlayersMap.has(id)) return;
    return game.otherPlayersMap.get(id)!;
  };

  const getOtherPlayerById = (id: string) => {
    return game.otherPlayersMap.get(id);
  };

  return {
    gameScene: game,
    preloaderScene: preloader,
    getLocalPlayer: () => game.localPlayer,
    network: preloader.network,
    isConnectedPlayer,
    getOtherPlayerById,
  };
};
