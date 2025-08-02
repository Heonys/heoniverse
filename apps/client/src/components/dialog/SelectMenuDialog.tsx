import { useState } from "react";
import { phaserGame } from "@/game";
import type { Preloader } from "@/game/scenes";
import { AppButton, Condition } from "@/common";
import { useAppSelector } from "@/hooks";
import { CustomRoomOverview } from "@/components/dialog";

export const SelectMenuDialog = () => {
  const [showCustomRoom, setShowCustomRoom] = useState(false);
  const lobbyJoined = useAppSelector((state) => state.room.lobbyJoined);

  return (
    <div className="fixed top-1/2 left-1/2 -translate-1/2 z-[9999]">
      <div className="bg-slate-800 relative text-[#eee] rounded-xl flex justify-center items-center gap-4 select-none">
        <Condition
          condition={!showCustomRoom}
          fallback={<CustomRoomOverview onPrevious={() => setShowCustomRoom(false)} />}
        >
          <div className="p-8 flex flex-col justify-center items-center gap-3">
            <AppButton
              className="px-4 font-medium"
              disabled={!lobbyJoined}
              onClick={() => {
                const preloader = phaserGame.scene.keys.preloader as Preloader;

                preloader.network.joinPublicRoom().then(() => {
                  preloader.launchGame();
                });
              }}
            >
              공개 방 참여하기
            </AppButton>

            <AppButton className="px-4 font-medium" onClick={() => setShowCustomRoom(true)}>
              커스텀 방 생성 / 참여
            </AppButton>
          </div>
        </Condition>
      </div>
    </div>
  );
};
