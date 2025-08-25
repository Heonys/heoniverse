import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useAppDispatch, useCurrentTime } from "@/hooks";
import { AppIcon } from "@/icons";
import { setCurrentPage } from "@/stores/phoneSlice";

export const Home = () => {
  const time = useCurrentTime();
  const dispatch = useAppDispatch();

  return (
    <div
      className="rounded-4xl flex size-full flex-col bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/background/iphone-wallpaper.jpg')" }}
    >
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
      </div>
      {/* center */}
      <div className="relative flex flex-1 flex-col gap-2 p-3">
        <div className="grid grid-cols-2 place-items-center">
          <div className="flex flex-col items-center gap-1">
            <div className="flex size-[106px] flex-col rounded-3xl bg-gradient-to-b from-blue-900 to-sky-300 p-2.5 text-[10px] text-white">
              <div className="ml-1 pb-2 text-3xl">23°</div>
              <AppIcon iconName="cloud" size={17} />
              <div className="">대체로 흐림</div>
              <div className="">최고 23° 최저 18°</div>
            </div>
            <div className="text-[9px] text-white">날씨</div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="size-[106px] rounded-3xl bg-white p-3.5 text-[10px]">
              <div>{format(time, "EEEE", { locale: ko })}</div>
              <div className="pb-3 text-2xl">{format(time, "d", { locale: ko })}</div>
              <div className="text-black/70">오늘 이벤트 없음</div>
            </div>
            <div className="text-[9px] text-white">캘린더</div>
          </div>
        </div>
        <div className="grid grid-cols-4">
          <div className="group flex cursor-pointer flex-col items-center gap-1">
            <img
              src="/icons/note.png"
              className="no-pixel size-13 group-hover:brightness-80 transition-all"
              alt="facetime"
            />
            <div className="text-[10px] text-white">메모</div>
          </div>
          <div className="group flex cursor-pointer flex-col items-center gap-1">
            <img
              src="/icons/photos.png"
              className="no-pixel size-13 group-hover:brightness-80 transition-all"
              alt="facetime"
            />
            <div className="text-[10px] text-white">사진</div>
          </div>
          <div className="group flex cursor-pointer flex-col items-center gap-1">
            <img
              src="/icons/maps.png"
              className="no-pixel size-13 group-hover:brightness-80 transition-all"
              alt="facetime"
            />
            <div className="text-[10px] text-white">지도</div>
          </div>
          <div className="group flex cursor-pointer flex-col items-center gap-1">
            <img
              src="/icons/music.png"
              className="no-pixel size-13 group-hover:brightness-80 transition-all"
              alt="facetime"
            />
            <div className="text-[10px] text-white">음악</div>
          </div>
        </div>
      </div>

      {/* bottom */}
      <div className="h-17 m-2 flex items-center justify-center gap-1 overflow-hidden rounded-[32px] bg-white/25 text-white backdrop-blur-3xl">
        <img
          src="/icons/phone.png"
          className="no-pixel size-13 hover:brightness-80 cursor-pointer transition-all"
          alt="phone"
          onClick={() => dispatch(setCurrentPage("contacts"))}
        />
        <img
          src="/icons/messages.png"
          className="no-pixel size-13 hover:brightness-80 cursor-pointer transition-all"
          alt="messages"
          onClick={() => dispatch(setCurrentPage("messages"))}
        />
      </div>
    </div>
  );
};
