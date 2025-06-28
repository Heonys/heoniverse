import { phaserGame } from "@/game";
import { Preloader } from "@/game/scenes";
import { AppButton } from "@/components/ui";

export const MenuDialog = () => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="bg-[#222639] text-[#eee] rounded-xl p-8 font-medium font-misans flex flex-col gap-4">
        <h1 className="text-2xl">Welcome to Heoniverse</h1>

        <div className="flex flex-col justify-center items-center gap-4">
          <AppButton
            onClick={() => {
              const preloader = phaserGame.scene.keys.preloader as Preloader;
              preloader.launchGame();
            }}
          >
            Move to Game
          </AppButton>
        </div>
      </div>
    </div>
  );
};
