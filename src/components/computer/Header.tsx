import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { twMerge } from "tailwind-merge";
import { HeaderButton } from "./HeaderButton";
import { AppIcon, ControlCenterIcon } from "@/icons";

export const Header = () => {
  return (
    <div
      className={twMerge(
        "overflow-hidden rounded-t-2xl w-full h-8 px-2 select-none",
        "flex items-center justify-between text-sm text-white bg-black/10 backdrop-blur-3xl shadow transition",
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
          <AppIcon iconName="search" color="white" size={16} />
        </HeaderButton>
        <HeaderButton>
          <ControlCenterIcon size={16} />
        </HeaderButton>
        <HeaderButton>
          <span>{format(new Date(), "MMM d일 (eee) a h:mm", { locale: ko })}</span>
        </HeaderButton>
      </div>
    </div>
  );
};
