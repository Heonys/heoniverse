import { useState } from "react";
import { AppButton, Switch, Case } from "@/common";
import { useAppSelector, useGame } from "@/hooks";
import { CustomRoomOverview, CreateRoomForm } from "@/components/dialog";
import Cityscape from "/images/background/cityscape-icon.jpeg";

const enum DialogView {
  Select,
  Overview,
  Create,
}

export const SelectMenuDialog = () => {
  const [dialogView, setDialogView] = useState<DialogView>(DialogView.Select);
  const { lobbyJoined, totalClients } = useAppSelector((state) => state.room);
  const { preloaderScene } = useGame();

  return (
    <div className="fixed top-1/2 left-1/2 -translate-1/2 z-[1111]">
      <div className="bg-[#323338] relative text-[#eee] rounded-xl flex justify-center items-center gap-4 select-none">
        <Switch switch={dialogView}>
          <Case case={DialogView.Select}>
            <div className="p-8 px-10 flex flex-col justify-center items-center gap-3 w-96">
              <div className="flex flex-col justify-center items-center gap-1 mb-4">
                <img
                  className="size-20 rounded-2xl"
                  draggable={false}
                  src={Cityscape}
                  alt="Cityscape"
                />
                <div className="text-white tracking-tight font-semibold text-[22px]">
                  Heoniverse
                </div>
                <div className="text-sm text-[#c2c2c2]">
                  함께 모여 소소하게 즐기고 이야기하는 곳
                </div>
                <div className="text-xs flex gap-1 items-center mt-1">
                  <div className="bg-[#42a25a] size-2 rounded-full ring ring-black/20"></div>
                  <div>{totalClients ?? 0}명 온라인</div>
                </div>
              </div>

              <AppButton
                className="p-2.5 font-medium w-full"
                disabled={!lobbyJoined}
                onClick={() => {
                  preloaderScene.network.joinPublicRoom().then(() => {
                    preloaderScene.launchGame();
                  });
                }}
              >
                공개 방 입장하기
              </AppButton>

              <AppButton
                className="p-2.5 font-medium w-full"
                disabled={!lobbyJoined}
                onClick={() => setDialogView(DialogView.Overview)}
              >
                커스텀 방 생성 / 입장
              </AppButton>
            </div>
          </Case>
          <Case case={DialogView.Overview}>
            <CustomRoomOverview
              onPrevious={() => setDialogView(DialogView.Select)}
              onCreate={() => setDialogView(DialogView.Create)}
            />
          </Case>
          <Case case={DialogView.Create}>
            <CreateRoomForm onPrevious={() => setDialogView(DialogView.Overview)} />
          </Case>
        </Switch>
      </div>
    </div>
  );
};
