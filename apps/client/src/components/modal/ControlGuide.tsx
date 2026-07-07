import { PropsWithChildren } from "react";
import { Backdrop } from "./Backdrop";
import { Kbd } from "./KeyboardUI";

export const ControlGuide = () => {
  return (
    <Backdrop className="max-w-[440px]">
      <div className="w-full select-none">
        <h2 className="text-[17px] font-semibold tracking-[-0.01em] text-white">조작 가이드</h2>

        <div className="mt-4">
          <GuideRow keys={["W", "A", "S", "D"]}>이동 — 방향키도 돼요</GuideRow>
          <GuideRow keys={["Shift"]}>달리기</GuideRow>
          <GuideRow keys={["E"]}>의자에 앉기</GuideRow>
          <GuideRow keys={["R"]}>컴퓨터·화이트보드·NPC 사용하기</GuideRow>
          <GuideRow keys={["Space"]}>공 차기</GuideRow>
          <GuideRow keys={["Enter"]}>채팅</GuideRow>
          <GuideRow keys={["G"]}>감정 표현</GuideRow>
          <GuideRow keys={["Esc"]}>창 닫기</GuideRow>
        </div>

        {/* <div className="text-text-faint mt-3.5 border-t border-white/[0.06] pt-3 text-[11.5px] leading-relaxed">
          컴퓨터·화이트보드·NPC 곁에 서면 사용할 수 있는 키가 머리 위에 떠요.
        </div> */}
      </div>
    </Backdrop>
  );
};

const GuideRow = ({ keys, children }: PropsWithChildren<{ keys: string[] }>) => {
  return (
    <div className="flex items-center gap-3.5 py-1.5">
      <div className="flex w-32 flex-none gap-1">
        {keys.map((key) => (
          <Kbd key={key}>{key}</Kbd>
        ))}
      </div>
      <div className="text-text-dim text-[12.5px]">{children}</div>
    </div>
  );
};
