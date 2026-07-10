import { useEffect, useState } from "react";
import { TrafficLights } from "@/components/computer";
import { getScreenshots, removeScreenshot, type Screenshot } from "@/utils/screenshotStore";
import { eventEmitter } from "@/game/events";
import { AppIcon } from "@/icons";
import { Condition } from "@/common";

const formatTime = (ts: number) =>
  new Date(ts).toLocaleString("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

// 아이폰 사진 앱과 같은 IndexedDB(스크린샷)를 본다
export const Photo = () => {
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
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-2xl bg-[#1e1e1e]">
      <div className="draggable-area relative flex h-7 w-full flex-none cursor-move items-center justify-center">
        <TrafficLights id="photo" />
        <span className="text-[12px] text-white/50">
          사진 {shots.length > 0 && `— ${shots.length}장`}
        </span>
      </div>

      <Condition
        condition={shots.length > 0}
        fallback={
          <div className="flex flex-1 select-none flex-col items-center justify-center gap-2 text-center">
            <AppIcon iconName="video" size={30} className="text-white/25" />
            <div className="text-[13.5px] font-semibold text-white/70">
              아직 스크린샷이 없습니다
            </div>
            <div className="text-[12px] text-white/40">
              게임 화면에서 <span className="font-retro text-white/70">P</span> 키를 눌러 지금 이
              순간을 남겨보세요
            </div>
          </div>
        }
      >
        <div className="grid flex-1 auto-rows-min grid-cols-3 gap-2.5 overflow-y-auto p-3">
          {shots.map((shot) => (
            <button
              key={shot.id}
              className="group relative aspect-video cursor-pointer overflow-hidden rounded-lg border border-white/10 transition hover:border-white/40"
              onClick={() => setSelected(shot)}
            >
              <img src={shot.dataUrl} alt="screenshot" className="size-full object-cover" />
              <span className="absolute bottom-1 left-1.5 rounded-md bg-black/55 px-1.5 py-0.5 text-[9.5px] text-white/90">
                {formatTime(shot.createdAt)}
              </span>
            </button>
          ))}
        </div>
      </Condition>

      {/* 라이트박스 */}
      {selected && (
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-black/85 p-6"
          onClick={() => setSelected(null)}
        >
          <img
            src={selected.dataUrl}
            alt="screenshot"
            className="max-h-[78%] max-w-full rounded-xl border border-white/15 object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <span className="mr-2 text-[11.5px] text-white/50">
              {formatTime(selected.createdAt)}
            </span>
            <button
              className="bg-accent cursor-pointer rounded-lg px-4 py-1.5 text-[12.5px] font-semibold text-white transition hover:brightness-[1.06]"
              onClick={() => download(selected)}
            >
              다운로드
            </button>
            <button
              className="cursor-pointer rounded-lg border border-white/15 bg-white/[0.06] px-4 py-1.5 text-[12.5px] text-white transition hover:bg-white/[0.12]"
              onClick={() => remove(selected)}
            >
              삭제
            </button>
            <button
              className="cursor-pointer rounded-lg border border-white/15 bg-white/[0.06] px-4 py-1.5 text-[12.5px] text-white transition hover:bg-white/[0.12]"
              onClick={() => setSelected(null)}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
