import { isBrowser } from "react-device-detect";
import { useAppSelector } from "@/hooks";
import { Condition } from "@/common";
import { cn } from "@/utils";

// 미니맵(Phaser 카메라 160×160 원형 마스크) 위에 얹는 DOM 프레임.
// 카메라 자체는 손대지 않고 인디고 링과 라벨만 씌운다.
// 위치는 Game.setupMinimapCamera와 짝: 데스크탑 좌상단(0,0) / 모바일 우상단(width-168, 52).
export const MinimapFrame = () => {
  const showMinimap = useAppSelector((state) => state.user.showMinimap);
  const loggedIn = useAppSelector((state) => state.user.loggedIn);

  return (
    <Condition condition={loggedIn && showMinimap}>
      <div
        className={cn(
          "pointer-events-none fixed z-10 size-40 select-none",
          isBrowser ? "left-0 top-0" : "right-2 top-[62px]",
        )}
      >
        {/* Phaser 마스크 원(중심 80,80 · 반지름 70)에 맞춘 링 */}
        <div className="border-accent/80 absolute left-[7px] top-[7px] size-[146px] rounded-full border-2 shadow-[0_0_0_3px_rgba(16,17,24,0.8),inset_0_0_18px_rgba(86,102,214,0.3)]" />
        <div className="border-accent/60 font-retro absolute bottom-0 left-1/2 -translate-x-1/2 rounded-md border bg-[#101118]/90 px-2 py-0.5 text-[10px] tracking-[1px] text-white">
          MAP
        </div>
      </div>
    </Condition>
  );
};
