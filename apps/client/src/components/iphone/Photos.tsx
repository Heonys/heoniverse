import { useEffect, useState } from "react";
import { useAppDispatch } from "@/hooks";
import { setCurrentPage } from "@/stores/phoneSlice";
import { getScreenshots, removeScreenshot, type Screenshot } from "@/utils/screenshotStore";
import { eventEmitter } from "@/game/events";
import { AppIcon } from "@/icons";
import { StatusBar, BackChevron } from "./StatusBar";

const formatTime = (ts: number) =>
  new Date(ts).toLocaleString("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

// macOS 사진 앱과 같은 IndexedDB(스크린샷)를 본다
export const Photos = () => {
  const dispatch = useAppDispatch();
  const [shots, setShots] = useState<Screenshot[]>([]);
  const [selected, setSelected] = useState<Screenshot | null>(null);

  useEffect(() => {
    const load = () => {
      getScreenshots()
        .then((list) => setShots(list.sort((a, b) => b.createdAt - a.createdAt)))
        .catch((err) => console.error("스크린샷 로드 실패:", err));
    };
    load();
    eventEmitter.on("SCREENSHOT_TAKEN", load);
    return () => eventEmitter.off("SCREENSHOT_TAKEN", load);
  }, []);

  const download = (shot: Screenshot) => {
    const a = document.createElement("a");
    a.href = shot.dataUrl;
    a.download = `heoniverse-${shot.createdAt}.png`;
    a.click();
  };

  const remove = async (shot: Screenshot) => {
    await removeScreenshot(shot.id);
    setShots((prev) => prev.filter((s) => s.id !== shot.id));
    setSelected(null);
  };

  return (
    <div className="rounded-4xl relative flex size-full flex-col overflow-hidden bg-white">
      {/* header */}
      <div className="relative flex flex-none flex-col text-black">
        <StatusBar />
        <div className="relative flex flex-col items-center justify-center gap-0.5 pb-2 pt-1">
          <div className="text-[15px] font-extrabold leading-tight">사진</div>
          <div className="text-[10px] text-black/45">{shots.length}장 · 컴퓨터와 공유됨</div>
          <BackChevron onClick={() => dispatch(setCurrentPage({ page: "home" }))} />
        </div>
      </div>

      {shots.length === 0 ? (
        <div className="flex flex-1 select-none flex-col items-center justify-center gap-1.5 border-t border-black/10 text-center">
          <AppIcon iconName="video" size={26} className="text-black/25" />
          <div className="text-[12px] font-semibold text-black/60">아직 사진이 없습니다</div>
          <div className="text-[10.5px] text-black/40">
            카메라 앱이나 <span className="font-retro">P</span> 키로 남겨보세요
          </div>
        </div>
      ) : (
        <div className="grid flex-1 auto-rows-min grid-cols-3 gap-0.5 overflow-y-auto border-t border-black/10 p-0.5">
          {shots.map((shot) => (
            <button
              key={shot.id}
              className="relative aspect-square cursor-pointer overflow-hidden rounded-sm"
              onClick={() => setSelected(shot)}
            >
              <img src={shot.dataUrl} alt="screenshot" className="size-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* 풀뷰 */}
      {selected && (
        <div className="absolute inset-0 z-10 flex flex-col bg-black">
          <div className="flex flex-none items-center justify-between px-4 pb-1 pt-10 text-[12px] text-[#0a84ff]">
            <button className="cursor-pointer" onClick={() => setSelected(null)}>
              ‹ 사진
            </button>
            <span className="text-white/50">{formatTime(selected.createdAt)}</span>
          </div>
          <div className="flex min-h-0 flex-1 items-center justify-center px-2">
            <img
              src={selected.dataUrl}
              alt="screenshot"
              className="max-h-full max-w-full rounded-lg object-contain"
            />
          </div>
          <div className="flex flex-none justify-around py-3 text-[12px] text-[#0a84ff]">
            <button className="cursor-pointer" onClick={() => download(selected)}>
              다운로드
            </button>
            <button className="cursor-pointer text-[#ff453a]" onClick={() => remove(selected)}>
              삭제
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
