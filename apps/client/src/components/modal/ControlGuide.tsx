import { PropsWithChildren, ReactNode } from "react";
import { isBrowser } from "react-device-detect";
import { Backdrop } from "./Backdrop";
import { Kbd } from "./KeyboardUI";
import { AppIcon } from "@/icons";
import { cn } from "@/utils";

export const ControlGuide = () => {
  return (
    <Backdrop className="max-w-[440px]">
      <div className="w-full select-none">
        <h2 className="text-[17px] font-semibold tracking-[-0.01em] text-white">조작 가이드</h2>

        {isBrowser ? (
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
        ) : (
          /* 모바일: 키보드 키 대신 조이스틱·버튼 기준으로 안내 */
          <div className="mt-4 flex flex-col gap-2.5">
            <TouchRow
              glyph={
                <div className="grid size-11 place-items-center rounded-full border-[1.5px] border-white/25 bg-white/[0.08]">
                  <div className="size-[18px] rounded-full bg-white/70" />
                </div>
              }
              title="조이스틱 — 이동"
              sub="걷기 전용, 달리기는 버튼으로"
            />
            <TouchRow
              glyph={<Glyph className="font-retro text-[8.5px]">Shift</Glyph>}
              title="달리기 켜기 / 끄기"
              sub="켜져 있는 동안 빠르게 이동"
            />
            <TouchRow
              glyph={<Glyph className="bg-accent/80 border-white/25 text-[15px]">R</Glyph>}
              title="상호작용"
              sub="컴퓨터·화이트보드·NPC 대화 · 프로필 보기"
            />
            <TouchRow
              glyph={<Glyph className="text-[13px]">E</Glyph>}
              title="의자에 앉기"
              sub="의자 근처에서 앉기 / 일어나기"
            />
            <TouchRow
              glyph={<Glyph className="font-retro text-[8.5px]">Space</Glyph>}
              title="펀치"
              sub="공 근처에선 공 차기"
            />
            <TouchRow
              glyph={<Glyph className="font-retro text-[13px]">G</Glyph>}
              title="이모트"
              sub="감정 표현을 머리 위에 표시"
            />
            <TouchRow
              glyph={
                <Glyph>
                  <AppIcon iconName="chat" size={17} />
                </Glyph>
              }
              title="채팅"
              sub="우측 상단 채팅 버튼으로 열기"
            />
          </div>
        )}

        {!isBrowser && (
          <div className="text-text-faint mt-4 border-t border-white/[0.06] pt-3 text-[11.5px] leading-relaxed">
            컴퓨터·화이트보드·NPC·사람 곁에 서면 사용할 수 있는 버튼이 안내됩니다.
          </div>
        )}
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

// 인게임 액션 버튼과 같은 톤의 원형 글리프
const Glyph = ({ className, children }: PropsWithChildren<{ className?: string }>) => (
  <div
    className={cn(
      "font-retro grid size-11 place-items-center rounded-full border-[1.5px] border-white/[0.16] bg-[#17181c]/80 text-white",
      className,
    )}
  >
    {children}
  </div>
);

const TouchRow = ({ glyph, title, sub }: { glyph: ReactNode; title: string; sub: string }) => (
  <div className="flex items-center gap-3.5">
    <div className="flex-none">{glyph}</div>
    <div className="min-w-0">
      <div className="text-[13.5px] font-semibold text-white">{title}</div>
      <div className="text-text-dim text-[11.5px]">{sub}</div>
    </div>
  </div>
);
