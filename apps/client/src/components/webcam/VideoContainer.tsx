import { AppIcon } from "@/icons";
import { AvatarIcon } from "../AvatarIcon";

export const VideoContainer = () => {
  return (
    <div className="absolute left-1/2 top-3 -translate-x-1/2">
      <Video />
    </div>
  );
};

// TODO: 생성 및 제거시 애니메이션 추가
function Video() {
  return (
    <div className="w-50 h-34 select-none rounded-2xl border border-black/50 bg-slate-800 shadow-lg">
      <div className="absolute left-2 top-2 flex items-center gap-1.5 rounded-lg bg-black/50 p-1 px-2 text-xs font-medium text-white backdrop-blur-2xl">
        <AppIcon iconName="mic-off" color="red" size={17} />
        <div>지헌</div>
      </div>
      <div className="-translate-1/2 absolute left-1/2 top-1/2 flex flex-col items-center gap-2">
        <AvatarIcon texture="adam" status="online" className="ring-2 ring-white/30" />
      </div>

      {/* <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center justify-center gap-1.5 rounded-lg bg-black px-2 py-1 text-white/90">
        <AppIcon iconName="bell" size={15} />
        <button className="cursor-pointer text-xs outline-none">알림 보내기</button>
      </div> */}

      {/* <div className="absolute -bottom-1 -right-1">
        <AvatarIcon texture="adam" status="available" />
      </div> */}
    </div>
  );
}
