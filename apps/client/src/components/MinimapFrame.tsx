import { useAppSelector } from "@/hooks";
import { Condition } from "@/common";

// 미니맵(좌상단 Phaser 카메라, 0,0에 160×160 원형 마스크) 위에 얹는 DOM 프레임.
// 카메라 자체는 손대지 않고 인디고 링과 라벨만 씌운다.
export const MinimapFrame = () => {
  const showMinimap = useAppSelector((state) => state.user.showMinimap);
  const loggedIn = useAppSelector((state) => state.user.loggedIn);

  return (
    <Condition condition={loggedIn && showMinimap}>
      <div className="pointer-events-none fixed left-0 top-0 z-10 size-40 select-none">
        {/* Phaser 마스크 원(중심 80,80 · 반지름 70)에 맞춘 링 */}
        <div className="border-accent/60 absolute left-[7px] top-[7px] size-[146px] rounded-full border-2 shadow-[0_0_0_3px_rgba(16,17,24,0.7),inset_0_0_18px_rgba(86,102,214,0.25)]" />
        <div className="border-accent/50 font-retro absolute bottom-0 left-1/2 -translate-x-1/2 rounded-md border bg-[#101118]/90 px-2 py-0.5 text-[10px] tracking-[1px] text-white">
          MAP
        </div>
      </div>
    </Condition>
  );
};
