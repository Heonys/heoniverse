import { useEffect, useRef, useState } from "react";
import { eventEmitter } from "@/game/events";
import { cn } from "@/utils";

// SCREENSHOT_TAKEN(모든 촬영 진입점)에 반응하는 전역 피드백
export const ScreenshotFlash = () => {
  const [flash, setFlash] = useState(false);
  const [toast, setToast] = useState(false);
  const flashTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const handler = () => {
      setFlash(true);
      setToast(true);
      clearTimeout(flashTimer.current);
      clearTimeout(toastTimer.current);
      flashTimer.current = setTimeout(() => setFlash(false), 160);
      toastTimer.current = setTimeout(() => setToast(false), 2200);
    };
    eventEmitter.on("SCREENSHOT_TAKEN", handler);
    return () => {
      eventEmitter.off("SCREENSHOT_TAKEN", handler);
      clearTimeout(flashTimer.current);
      clearTimeout(toastTimer.current);
    };
  }, []);

  return (
    <>
      <div
        className={cn(
          "pointer-events-none fixed inset-0 z-[90] bg-white transition-opacity",
          flash ? "opacity-60 duration-0" : "opacity-0 duration-300",
        )}
      />
      <div
        className={cn(
          "pointer-events-none fixed bottom-16 left-1/2 z-[90] -translate-x-1/2 select-none rounded-full border border-white/[0.12] bg-[rgba(20,26,40,0.92)] px-4 py-[9px] text-[12.5px] text-white shadow-[0_12px_28px_-12px_rgba(0,0,0,0.6)] transition-all duration-200",
          toast ? "translate-y-0 opacity-100" : "translate-y-2.5 opacity-0",
        )}
      >
        스크린샷이 컴퓨터의 사진 앱에 저장되었습니다
      </div>
    </>
  );
};
