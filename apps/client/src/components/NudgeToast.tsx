import { useEffect, useRef, useState } from "react";
import { eventEmitter } from "@/game/events";
import { cn, playNudgeSound, showDesktopNudge } from "@/utils";

// 콕 찌르기 수신 — 게임을 보고 있으면 하단 pill 토스트 + 핑 사운드,
// 안 보고 있으면(숨김/다른 창) 데스크탑 알림(권한 없으면 토스트로 남겨 복귀 시 보이게)
export const NudgeToast = () => {
  const [senderName, setSenderName] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  // 사라지는 트랜지션 동안에도 내용이 남게 마지막 이름을 기억한다
  const lastName = useRef("");

  useEffect(() => {
    const handler = ({ name }: { sessionId: string; name: string }) => {
      const sender = name || "누군가";
      // "게임을 지금 보고 있나"로 판단 — 최소화/다른 탭이거나 다른 창을 보고 있으면(포커스 아님)
      // 데스크탑 알림을 우선한다. 보고 있을 때만 인앱 토스트 + 핑.
      const away = document.visibilityState === "hidden" || !document.hasFocus();

      if (away && showDesktopNudge(sender)) return;
      if (!away) playNudgeSound();

      setSenderName(sender);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setSenderName(null), 4000);
    };

    eventEmitter.on("NUDGED", handler);
    return () => {
      eventEmitter.off("NUDGED", handler);
      clearTimeout(timer.current);
    };
  }, []);

  if (senderName) lastName.current = senderName;

  return (
    <div
      className={cn(
        "pointer-events-none fixed bottom-16 left-1/2 z-[60] -translate-x-1/2 select-none rounded-full border border-white/[0.12] bg-[rgba(20,26,40,0.92)] px-4 py-[9px] text-[12.5px] text-white shadow-[0_12px_28px_-12px_rgba(0,0,0,0.6)] transition-all duration-200",
        senderName ? "translate-y-0 opacity-100" : "translate-y-2.5 opacity-0",
      )}
    >
      {lastName.current}님이 콕 찔렀어요
    </div>
  );
};
