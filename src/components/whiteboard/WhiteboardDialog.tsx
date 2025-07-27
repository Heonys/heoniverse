import { TooltipButton } from "@/common";
import { useAppDispatch } from "@/hooks";
import { AppIcon } from "@/icons";
import { closeWhiteboardDialog } from "@/stores/whiteboardSlice";
import { WhiteBoard } from "@/components/whiteboard";

export const WhiteboardDialog = () => {
  const dispatch = useAppDispatch();

  return (
    <div className="fixed top-0 left-0 w-full h-full p-5 backdrop-blur-xs z-[9999]">
      <div
        className="relative w-full h-full bg-[#030303] 
        rounded-[24px] shadow-2xl border-[1.5px] border-neutral-400/60 overflow-hidden p-2.5"
      >
        <WhiteBoard />
      </div>
      <div className="fixed bottom-2 right-5 flex gap-2 z-[9999]">
        <TooltipButton tooltip="help">
          <AppIcon iconName="help" color="black" size={25} />
        </TooltipButton>
        <TooltipButton
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
