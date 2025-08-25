import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { twMerge } from "tailwind-merge";
import { HeaderButton } from "./HeaderButton";
import { AppIcon, ControlCenterIcon } from "@/icons";
import { useAppSelector, useCurrentTime } from "@/hooks";
import { visibleAppCount } from "@/stores/desktopSlice";

export const Header = () => {
  const time = useCurrentTime();
  const currentApp = useAppSelector((state) => state.desktop.currentApp);
  const count = useAppSelector(visibleAppCount);

  return (
    <div
      className={twMerge(
        "h-8 w-full select-none overflow-hidden rounded-t-2xl px-2",
        "flex items-center justify-between bg-black/15 text-sm text-white shadow backdrop-blur-3xl transition",
      )}
    >
      <div className="flex">
        <HeaderButton>
          <AppIcon iconName="apple-logo" color="white" size={20} />
        </HeaderButton>
        <HeaderButton>
          <span className="font-bold">{count ? currentApp : "Finder"}</span>
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
          <span>{format(time, "MMM d일 (eee) a h:mm", { locale: ko })}</span>
        </HeaderButton>
      </div>
    </div>
  );
};
