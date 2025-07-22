import { useAppDispatch } from "@/hooks";
import { TooltipButton } from "@/common";
import { closeComputerDialog } from "@/stores/computerSlice";
import { Dock, Header } from "@/components/computer";
import { AppIcon } from "@/icons";
import { Bootstrap } from "./Bootstrap";

export const ComputerDialog = () => {
  const dispatch = useAppDispatch();
  return (
    <div id="desktop" className="fixed top-0 left-0 w-full h-full p-5 backdrop-blur-xs z-[9999]">
      <div
        className="relative w-full h-full bg-black 
        rounded-[24px] shadow-2xl border-[1.5px] border-neutral-400/60 overflow-hidden p-2"
      >
        <div
          className="relative w-full h-full rounded-2xl"
          style={{
            backgroundImage: "url('/images/background/wallpaper.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <Bootstrap />
          <Header />
          <Dock />
        </div>
      </div>

      <div className="fixed bottom-2 right-5 flex gap-2 z-[9999]">
        <TooltipButton
          tooltip="Shut Down"
          onClick={() => {
            dispatch(closeComputerDialog());
          }}
        >
          <AppIcon iconName="shut-down" color="black" size={25} />
        </TooltipButton>
      </div>
    </div>
  );
};
