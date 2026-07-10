import { useEffect, useState } from "react";
import { useAppDispatch } from "@/hooks";
import { setCurrentPage } from "@/stores/phoneSlice";
import { captureScreenshot } from "@/utils/captureScreenshot";
import { getScreenshots } from "@/utils/screenshotStore";
import { eventEmitter } from "@/game/events";
import { StatusBar, BackChevron } from "./StatusBar";

// 아이폰 카메라 — P키와 같은 파이프라인(captureScreenshot)으로 게임 화면을 촬영한다.
// 목업 화면은 게임 위에 떠 있으므로 라이브 프리뷰 대신 안내 + 셔터로 구성.
export const Camera = () => {
  const dispatch = useAppDispatch();
  const [lastShot, setLastShot] = useState<string | null>(null);

  const loadLast = () => {
    getScreenshots()
      .then((list) => {
        const latest = list.sort((a, b) => b.createdAt - a.createdAt)[0];
        setLastShot(latest?.dataUrl ?? null);
      })
      .catch(() => setLastShot(null));
  };

  useEffect(() => {
    loadLast();
    eventEmitter.on("SCREENSHOT_TAKEN", loadLast);
    return () => eventEmitter.off("SCREENSHOT_TAKEN", loadLast);
  }, []);

  return (
    <div className="rounded-4xl flex size-full flex-col bg-[#111]">
      {/* header */}
      <div className="relative flex flex-none flex-col text-white">
        <StatusBar tone="dark" />
        <div className="relative flex h-8 items-center justify-center text-[13px] font-semibold">
          카메라
          <BackChevron color="#ffffff" onClick={() => dispatch(setCurrentPage({ page: "home" }))} />
        </div>
      </div>

      {/* 뷰파인더 프레임 */}
      <div className="relative mx-3 mb-2.5 flex-1 overflow-hidden rounded-xl border border-white/[0.15] bg-[#1a1b20]">
        <div className="absolute inset-0 grid select-none place-items-center px-6 text-center">
          <div>
            <div className="text-[12px] font-semibold text-white/80">게임 화면 촬영</div>
            <div className="mt-1 text-[10.5px] leading-relaxed text-white/45">
              셔터를 누르면 지금 보고 있는
              <br />
              게임 화면이 그대로 담깁니다
            </div>
          </div>
        </div>
        {/* 모서리 가이드 */}
        <div className="pointer-events-none absolute left-3 top-3 size-5 rounded-tl-md border-l-2 border-t-2 border-white/40" />
        <div className="pointer-events-none absolute right-3 top-3 size-5 rounded-tr-md border-r-2 border-t-2 border-white/40" />
        <div className="pointer-events-none absolute bottom-3 left-3 size-5 rounded-bl-md border-b-2 border-l-2 border-white/40" />
        <div className="pointer-events-none absolute bottom-3 right-3 size-5 rounded-br-md border-b-2 border-r-2 border-white/40" />
      </div>

      {/* 컨트롤 */}
      <div className="flex flex-none items-center justify-between px-6 pb-6 pt-1">
        <button
          className="relative size-10 cursor-pointer overflow-hidden rounded-lg border border-white/25 bg-[#26262a]"
          onClick={() => dispatch(setCurrentPage({ page: "photos" }))}
          aria-label="사진 앱으로"
        >
          {lastShot && <img src={lastShot} alt="latest" className="size-full object-cover" />}
        </button>
        <button
          className="size-14 cursor-pointer rounded-full border-4 border-white/35 bg-white bg-clip-content p-0.5 transition-transform active:scale-90"
          onClick={captureScreenshot}
          aria-label="촬영"
        />
        {/* 셔터 중앙 정렬용 스페이서 (좌측 썸네일과 대칭) */}
        <div className="size-10" />
      </div>
    </div>
  );
};
