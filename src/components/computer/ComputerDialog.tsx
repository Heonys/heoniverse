import { twMerge } from "tailwind-merge";
import { useAppDispatch } from "@/hooks";
import { AppIcon, ControlCenterIcon, TooltipButton } from "@/common";
import { closeComputerDialog } from "@/stores/computerSlice";
import { Dock, HeaderButton } from "@/components/computer";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

export const ComputerDialog = () => {
  const dispatch = useAppDispatch();
  return (
    <div className="fixed top-0 left-0 w-full h-full p-5 backdrop-blur-xs z-[9999]">
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
          <div
            className={twMerge(
              "absolute overflow-hidden rounded-t-2xl top-0 w-full h-8 px-2",
              "flex items-center justify-between text-sm text-white bg-gray-700/10 backdrop-blur-2xl shadow transition",
            )}
          >
            <div className="flex">
              <HeaderButton>
                <AppIcon iconName="apple-logo" color="white" size={20} />
              </HeaderButton>
              <HeaderButton>
                <span className="font-bold">Finder</span>
              </HeaderButton>
            </div>

            <div className="flex">
              <HeaderButton>
                <span className="text-xs font-semibold">99%</span>
                <AppIcon iconName="batterty-charging" color="white" size={20} />
              </HeaderButton>
              <HeaderButton>
                <AppIcon iconName="wifi" color="white" size={16} />
              </HeaderButton>
              <HeaderButton>
                <ControlCenterIcon size={16} />
              </HeaderButton>
              <HeaderButton>
                <span>{format(new Date(), "MMM d일 (eee) a h:mm", { locale: ko })}</span>
              </HeaderButton>
            </div>
          </div>
          <Dock />
        </div>
      </div>

      <div className="fixed bottom-2 right-5 flex gap-2">
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
