import { useAppDispatch } from "@/hooks";
import { TooltipButton } from "@/common";
import { closeComputerDialog } from "@/stores/computerSlice";
import { Desktop } from "@/components/computer";
import { AppIcon } from "@/icons";
import { shutdownDesktop } from "@/stores/desktopSlice";

export const ComputerDialog = () => {
  const dispatch = useAppDispatch();
  return (
    <div id="desktop" className="fixed top-0 left-0 w-full h-full p-5 backdrop-blur-xs z-[9999]">
      <div
        className="relative w-full h-full bg-[#030303] 
        rounded-[24px] shadow-2xl border-[1.5px] border-neutral-400/60 overflow-hidden p-2.5"
      >
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-[210px] h-[25px] bg-[#030303] rounded-b-[10px] z-[10000]">
          <div className="absolute top-0 -left-4 size-4 rounded-full shadow-[8px_-8px_0_0_#030303]" />
          <div className="absolute top-0 -right-4 size-4 rounded-full shadow-[-8px_-8px_0_0_#030303]" />
        </div>
        <Desktop />
      </div>

      <div className="fixed bottom-2 right-5 flex gap-2 z-[9999]">
        <TooltipButton
          tooltip="Shut Down"
          onClick={() => {
            dispatch(closeComputerDialog());
            dispatch(shutdownDesktop());
          }}
        >
          <AppIcon iconName="shut-down" color="black" size={25} />
        </TooltipButton>
      </div>
    </div>
  );
};
