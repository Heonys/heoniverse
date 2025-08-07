import { useState } from "react";
import { AppButton, Switch, Case } from "@/common";
import { useAppSelector, useGame } from "@/hooks";
import { CustomRoomOverview, CreateRoomForm } from "@/components/dialog";

const enum DialogView {
  Select,
  Overview,
  Create,
}

export const SelectMenuDialog = () => {
  const [dialogView, setDialogView] = useState<DialogView>(DialogView.Select);
  const lobbyJoined = useAppSelector((state) => state.room.lobbyJoined);
  const { preloaderScene } = useGame();

  return (
    <div className="fixed top-1/2 left-1/2 -translate-1/2 z-[1111]">
      <div className="bg-slate-800 relative text-[#eee] rounded-xl flex justify-center items-center gap-4 select-none">
        <Switch switch={dialogView}>
          <Case case={DialogView.Select}>
            <div className="p-8 flex flex-col justify-center items-center gap-3">
              <AppButton
                className="px-4 font-medium"
                disabled={!lobbyJoined}
                onClick={() => {
                  preloaderScene.network.joinPublicRoom().then(() => {
                    preloaderScene.launchGame();
                  });
                }}
              >
                공개 방 참여하기
              </AppButton>

              <AppButton
                className="px-4 font-medium"
                disabled={!lobbyJoined}
                onClick={() => setDialogView(DialogView.Overview)}
              >
                커스텀 방 생성 / 참여
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
