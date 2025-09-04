import { useAppDispatch, useAppSelector, useGame, useModal } from "@/hooks";
import { Condition, TooltipButton } from "@/common";
import { closeComputerDialog, currentSharing, setJoinedSharing } from "@/stores/computerSlice";
import { Desktop } from "@/components/computer";
import { AppIcon } from "@/icons";
import { shutdownDesktop } from "@/stores/desktopSlice";

export const ComputerDialog = () => {
  const dispatch = useAppDispatch();
  const sharing = useAppSelector(currentSharing);
  const { network, getLocalPlayer } = useGame();
  const { showModal } = useModal();

  const isSharingMe = sharing && sharing.sharingUserId === getLocalPlayer().playerId;

  return (
    <div id="desktop" className="backdrop-blur-xs fixed left-0 top-0 z-[9999] h-full w-full p-5">
      <div className="relative h-full w-full overflow-hidden rounded-[24px] border-[1.5px] border-neutral-400/60 bg-[#030303] p-2.5 shadow-2xl">
        <div className="absolute left-1/2 top-2.5 z-[10000] h-[25px] w-[210px] -translate-x-1/2 rounded-b-[10px] bg-[#030303]">
          <div className="absolute -left-4 top-0 size-4 rounded-full shadow-[8px_-8px_0_0_#030303]" />
          <div className="absolute -right-4 top-0 size-4 rounded-full shadow-[-8px_-8px_0_0_#030303]" />
        </div>
        <Desktop />
      </div>

      <div className="fixed bottom-2 right-5 z-[9999] flex gap-2">
        <TooltipButton
          id="desktop-help"
          tooltip="조작 가이드"
          onClick={() => {
            showModal("ComputerGuide");
          }}
        >
          <AppIcon iconName="help" color="black" size={25} />
        </TooltipButton>

        <Condition condition={!isSharingMe}>
          <TooltipButton
            id="desktop-shutdown"
            tooltip="전원 종료"
            onClick={() => {
              dispatch(closeComputerDialog());
              dispatch(shutdownDesktop());
              dispatch(setJoinedSharing(false));
              if (network.webRTC?.connectedCall) {
                network.webRTC.connectedCall.close();
                network.webRTC.connectedCall = undefined;
              }
            }}
          >
            <AppIcon iconName="shut-down" color="black" size={25} />
          </TooltipButton>
        </Condition>
      </div>
    </div>
  );
};
