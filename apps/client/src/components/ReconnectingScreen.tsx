import Cityscape from "/images/background/cityscape-icon.jpeg";
import { ProgressBar } from "@/components";

// 부팅 시 자동 재접속을 시도하는 동안 표시 — 그 사이 로비/메뉴가 깜빡이는 것을 막는다
export const ReconnectingScreen = () => {
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-[#1f2023]">
      <div className="flex select-none flex-col items-center justify-center gap-4 rounded-2xl bg-[#323338] px-16 py-10 text-[#eee] shadow-xl">
        <img className="size-20 rounded-2xl" draggable={false} src={Cityscape} alt="Heoniverse" />
        <div className="text-[22px] font-semibold tracking-tight text-white">Heoniverse</div>
        <ProgressBar message="이전 세션에 다시 연결하는 중..." />
      </div>
    </div>
  );
};
