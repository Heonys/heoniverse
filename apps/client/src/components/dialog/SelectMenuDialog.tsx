import { useState } from "react";
import { AppButton, Switch, Case, Condition } from "@/common";
import { useAppSelector, useGame } from "@/hooks";
import { CustomRoomOverview, CreateRoomForm, HelpMenu } from "@/components/dialog";
import Cityscape from "/images/background/cityscape-icon.jpeg";
import { AppIcon } from "@/icons";
import { ProgressBar } from "@/components";

const enum DialogView {
  Select,
  Overview,
  Create,
  Guide,
}

export const SelectMenuDialog = () => {
  const [dialogView, setDialogView] = useState<DialogView>(DialogView.Select);
  const { lobbyJoined, totalClients } = useAppSelector((state) => state.room);
  const { preloaderScene } = useGame();

  return (
    <div className="-translate-1/2 fixed left-1/2 top-1/2 z-[1111]">
      <div className="relative flex select-none items-center justify-center gap-4 rounded-xl bg-[#323338] text-[#eee]">
        <Switch switch={dialogView}>
          <Case case={DialogView.Select}>
            <div className="flex w-96 flex-col items-center justify-center gap-3 p-8 px-12">
              <div className="mb-2 flex flex-col items-center justify-center gap-1">
                <img
                  className="size-20 rounded-2xl"
                  draggable={false}
                  src={Cityscape}
                  alt="Cityscape"
                />
                <div className="text-[22px] font-semibold tracking-tight text-white">
                  Heoniverse
                </div>
                <div className="text-sm text-[#c2c2c2]">
                  함께 모여 소소하게 즐기고 이야기하는 곳
                </div>
                <div className="my-1 flex items-center gap-1.5 text-xs">
                  <div className="size-2 rounded-full bg-[#42a25a] ring ring-black/20"></div>
                  <div>{Math.max(totalClients - 1, 0)}명 온라인</div>
                </div>

                <Condition condition={!lobbyJoined}>
                  <ProgressBar message="Connecting to server..." />
                </Condition>
              </div>

              <AppButton
                className="w-full p-2.5 font-medium"
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
                className="w-full p-2.5 font-medium"
                disabled={!lobbyJoined}
                onClick={() => setDialogView(DialogView.Overview)}
              >
                커스텀 방 생성 / 입장
              </AppButton>

              <AppButton
                className="w-full bg-[#62666f] p-2.5 font-medium"
                onClick={() => setDialogView(DialogView.Guide)}
              >
                <div className="flex items-center justify-center gap-1.5">
                  <div>도움말</div>
                  <AppIcon iconName="help" size={17} />
                </div>
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
          <Case case={DialogView.Guide}>
            <HelpMenu onPrevious={() => setDialogView(DialogView.Select)} />
          </Case>
        </Switch>
      </div>
    </div>
  );
};
