import { phaserGame } from "@/game";
import type { Preloader } from "@/game/scenes";
import { AppButton } from "@/common";
import { useAppSelector } from "@/hooks";

export const SelectMenuDialog = () => {
  const lobbyJoined = useAppSelector((state) => state.room.lobbyJoined);

  return (
    <div className="fixed top-1/2 left-1/2 -translate-1/2 z-[9999]">
      <div className="bg-slate-900 text-[#eee] rounded-xl p-8 font-medium flex flex-col gap-4 select-none">
        <h1 className="text-2xl font-misans">Welcome to Heoniverse</h1>

        <div className="flex flex-col justify-center items-center gap-4">
          <AppButton
            className="px-4"
            disabled={!lobbyJoined}
            onClick={() => {
              const preloader = phaserGame.scene.keys.preloader as Preloader;

              preloader.network.joinPublicRoom().then(() => {
                preloader.launchGame();
              });
            }}
          >
            Public Room Join
          </AppButton>
        </div>
      </div>
    </div>
  );
};
