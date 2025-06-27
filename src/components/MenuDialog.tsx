import { Button } from "@headlessui/react";
import { phaserGame } from "@/game";

export const MenuDialog = () => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="bg-[#222639] text-[#eee] rounded-xl p-8 font-medium font-misans flex flex-col gap-4">
        <h1 className="text-2xl">Welcome to Heoniverse</h1>

        <div className="flex flex-col justify-center items-center gap-4">
          <Button
            className="rounded bg-sky-600 px-4 py-2 text-sm text-white data-active:bg-sky-700 data-hover:bg-sky-500"
            onClick={() => {
              phaserGame.scene.stop("Background");
              phaserGame.scene.start("Game");
            }}
          >
            Move to Game
          </Button>

          <Button
            className="rounded bg-sky-600 px-4 py-2 text-sm text-white data-active:bg-sky-700 data-hover:bg-sky-500"
            onClick={() => {
              phaserGame.scene.stop("Game");
              phaserGame.scene.start("Background");
            }}
          >
            Move to Background
          </Button>
        </div>
      </div>
    </div>
  );
};
