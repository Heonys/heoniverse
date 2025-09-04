import { TooltipButton } from "@/common";
import { useAppDispatch, useModal } from "@/hooks";
import { AppIcon } from "@/icons";
import { closeWhiteboardDialog } from "@/stores/whiteboardSlice";
import { WhiteBoard } from "@/components/whiteboard";

export const WhiteboardDialog = () => {
  const dispatch = useAppDispatch();
  const { showModal } = useModal();

  return (
    <div className="backdrop-blur-xs fixed left-0 top-0 z-[9999] h-full w-full p-5">
      <div className="relative h-full w-full overflow-hidden rounded-[24px] border-[1.5px] border-neutral-400/60 bg-[#030303] p-2.5 shadow-2xl">
        <WhiteBoard />
      </div>
      <div className="fixed bottom-2 right-5 z-[9999] flex gap-2">
        <TooltipButton
          id="whiteboard-help"
          tooltip="조작 가이드"
          onClick={() => {
            showModal("WhiteboardGuide");
          }}
        >
          <AppIcon iconName="help" color="black" size={25} />
        </TooltipButton>
        <TooltipButton
          id="whiteboard-exit"
          tooltip="Exit Board"
          onClick={() => {
            dispatch(closeWhiteboardDialog());
          }}
        >
          <AppIcon iconName="exit" color="black" size={25} />
        </TooltipButton>
      </div>
    </div>
  );
};
