import { format } from "date-fns";
import { useAppDispatch, useCurrentTime } from "@/hooks";
import { AppIcon } from "@/icons";
import { setCurrentPage } from "@/stores/phoneSlice";

export const Dialing = () => {
  const dispatch = useAppDispatch();
  const time = useCurrentTime();

  return (
    <div
      className="rounded-4xl size-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/background/iphone-wallpaper.jpg')" }}
    >
      <div className="rounded-4xl flex size-full flex-col bg-black/60 backdrop-blur-lg">
        {/* header */}
        <div className="rounded-t-4xl relative flex flex-col text-lg font-bold text-white">
          <div className="absolute left-1/2 top-2 h-[22px] w-20 -translate-x-1/2 rounded-full bg-[#040404]" />
          <div className="relative flex h-9 w-full items-center px-5 py-2 text-[13px]">
            <div className="ml-2">{format(time, "h:mm")}</div>
            <div className="flex flex-1 items-center justify-end gap-1.5">
              <AppIcon iconName="signal" size={14} />
              <AppIcon iconName="wifi" size={14} />
              <AppIcon iconName="batterty-half" size={16} />
            </div>
          </div>
          <div className="h-13"></div>
        </div>

        {/* center */}
        <div className="flex flex-1 flex-col items-center pb-20 text-white">
          <div className="flex flex-col items-center gap-0.5">
            <div className="text-2xl">김지헌</div>
            {/* <div className="text-sm text-white/50">00:10</div> */}
            <div className="text-sm text-white/50">연결중...</div>
          </div>
          <div className="flex flex-1 flex-col items-center justify-end gap-5">
            <div className="flex gap-5">
              <div className="flex flex-col items-center gap-1 text-[10px]">
                <div className="flex size-11 cursor-pointer items-center justify-center rounded-full bg-white/30 p-2">
                  <AppIcon iconName="video-on" size={23} />
                </div>
                <div>카메라</div>
              </div>
              <div className="flex flex-col items-center gap-1 text-[10px]">
                <div className="flex size-11 cursor-pointer items-center justify-center rounded-full bg-white/70 p-2 text-black">
                  <AppIcon iconName="mic-off" size={23} />
                </div>
                <div>마이크</div>
              </div>
            </div>

            <div
              className="flex cursor-pointer flex-col items-center gap-1 text-[10px]"
              onClick={() => dispatch(setCurrentPage("contacts"))}
            >
              <div className="flex size-11 cursor-pointer items-center justify-center rounded-full bg-[#fa4837] p-2">
                <AppIcon iconName="hang-up" size={23} />
              </div>
              <div>종료</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
