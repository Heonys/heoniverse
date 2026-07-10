import { useEffect, useRef, useState } from "react";
import { TrafficLights } from "@/components/computer";
import { TRACKS, ALBUMS, formatSec } from "@/constants/musicTracks";
import { cn } from "@/utils";

// 트랙 목록은 아이폰 목업·모바일 시트와 공유(musicTracks.ts)
const RED = "#fa2d48";

export const Music = () => {
  const [trackIndex, setTrackIndex] = useState(-1); // -1 = 재생 이력 없음
  const [playing, setPlaying] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval>>(undefined);

  const track = trackIndex >= 0 ? TRACKS[trackIndex] : null;

  // 가짜 재생 타이머 — 오디오 연결 시 <audio> timeupdate로 교체 지점
  useEffect(() => {
    clearInterval(timer.current);
    if (playing) {
      timer.current = setInterval(() => {
        setSeconds((prev) => {
          if (trackIndex >= 0 && prev + 1 >= TRACKS[trackIndex].duration) {
            setTrackIndex((i) => (i + 1) % TRACKS.length);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer.current);
  }, [playing, trackIndex]);

  const pick = (index: number) => {
    setTrackIndex(index);
    setSeconds(0);
    setPlaying(true);
  };
  const toggle = () => {
    if (trackIndex < 0) setTrackIndex(0);
    setPlaying((prev) => !prev);
  };
  const step = (delta: number) => {
    if (trackIndex < 0) return;
    setTrackIndex((trackIndex + delta + TRACKS.length) % TRACKS.length);
    setSeconds(0);
  };
  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!track) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setSeconds(Math.floor(((e.clientX - rect.left) / rect.width) * track.duration));
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl bg-[#1c1c1e]">
      <div className="draggable-area relative flex h-7 w-full flex-none cursor-move items-center justify-center bg-[#28282a]">
        <TrafficLights id="music" />
        <span className="text-[12px] text-white/50">음악</span>
      </div>

      {/* 상단 재생바 */}
      <div className="flex flex-none items-center gap-4 border-b border-white/[0.06] bg-[#28282a] px-4 py-2">
        <div className="flex items-center gap-3.5">
          <button className="cursor-pointer text-[15px] text-[#d8d8dc]" onClick={() => step(-1)}>
            ⏮
          </button>
          <button className="cursor-pointer text-[19px] text-[#d8d8dc]" onClick={toggle}>
            {playing ? "⏸" : "▶"}
          </button>
          <button className="cursor-pointer text-[15px] text-[#d8d8dc]" onClick={() => step(1)}>
            ⏭
          </button>
        </div>
        {/* LCD */}
        <div className="relative mx-auto flex h-11 max-w-[380px] flex-1 items-center gap-2.5 overflow-hidden rounded-lg border border-white/[0.07] bg-[#1a1a1c] pl-1.5 pr-3">
          {track ? (
            <>
              <div
                className="grid size-8 flex-none place-items-center rounded-md text-[15px]"
                style={{ background: track.gradient }}
              >
                {track.emoji}
              </div>
              <div className="min-w-0 flex-1 text-center">
                <div className="truncate text-[11.5px] font-semibold text-[#eee]">
                  {track.title}
                </div>
                <div className="truncate text-[10px] text-[#9a9aa0]">
                  {track.artist} — {track.album} · {formatSec(seconds)} /{" "}
                  {formatSec(track.duration)}
                </div>
              </div>
              <div
                className="absolute inset-x-0 bottom-0 h-[3px] cursor-pointer bg-white/10"
                onClick={seek}
              >
                <div
                  className="h-full"
                  style={{ width: `${(seconds / track.duration) * 100}%`, background: RED }}
                />
              </div>
            </>
          ) : (
            <div className="w-full text-center text-[12px] text-[#7a7a80]"> 음악</div>
          )}
        </div>
        {/* 볼륨 (장식) */}
        <div className="flex items-center gap-1.5 text-[12px] text-[#9a9aa0]">
          🔈
          <div className="relative h-[3.5px] w-16 rounded-full bg-white/[0.14]">
            <div className="absolute inset-y-0 left-0 w-[65%] rounded-full bg-[#c8c8cc]" />
          </div>
        </div>
      </div>

      {/* 사이드바 + 콘텐츠 */}
      <div className="flex min-h-0 flex-1">
        <div className="w-40 flex-none overflow-y-auto border-r border-white/[0.06] bg-[#202022] px-2 py-3 text-[12px]">
          <div className="px-2 pb-1 pt-2 text-[10px] font-bold tracking-wide text-[#7a7a80]">
            보관함
          </div>
          <SideItem active icon="♫" label="노래" />
          <SideItem icon="▦" label="앨범" />
          <SideItem icon="👤" label="아티스트" />
          <div className="px-2 pb-1 pt-3 text-[10px] font-bold tracking-wide text-[#7a7a80]">
            재생목록
          </div>
          <SideItem icon="☰" label="Heoniverse Mix" />
          <SideItem icon="☰" label="코딩용 로파이" />
        </div>

        <div className="min-w-0 flex-1 overflow-y-auto px-4 py-4">
          <div className="mb-3 text-[18px] font-extrabold text-[#f2f2f4]">노래</div>
          {/* 앨범 카드 */}
          <div className="mb-4 grid grid-cols-3 gap-3.5">
            {ALBUMS.map((album) => {
              const first = TRACKS.find((t) => t.album === album)!;
              return (
                <button
                  key={album}
                  className="group cursor-pointer text-left"
                  onClick={() => pick(TRACKS.indexOf(first))}
                >
                  <div
                    className="grid aspect-square place-items-center rounded-lg text-[34px] shadow-[0_8px_18px_-8px_rgba(0,0,0,0.5)] transition-transform group-hover:scale-[1.03]"
                    style={{ background: first.gradient }}
                  >
                    {first.emoji}
                  </div>
                  <div className="mt-1.5 truncate text-[11.5px] font-semibold text-[#e8e8ec]">
                    {album}
                  </div>
                  <div className="text-[10.5px] text-[#9a9aa0]">{first.artist}</div>
                </button>
              );
            })}
          </div>
          {/* 트랙 리스트 */}
          <div className="pb-1.5 text-[12.5px] font-bold text-[#f2f2f4]">전체 트랙</div>
          {TRACKS.map((t, i) => (
            <button
              key={t.title}
              className={cn(
                "flex w-full cursor-pointer items-center gap-2.5 rounded-[7px] px-2 py-1.5 text-left text-[12px] hover:bg-white/[0.05]",
                i === trackIndex ? "text-[#ff6b7f]" : "text-[#d8d8dc]",
              )}
              onClick={() => pick(i)}
            >
              <span className="w-4 flex-none text-center text-[10.5px] text-[#7a7a80]">
                {i === trackIndex && playing ? (
                  <span className="inline-flex h-2.5 w-3.5 items-end justify-center gap-[1.5px]">
                    {[0, 1, 2].map((n) => (
                      <span
                        key={n}
                        className="w-[2.5px] animate-pulse rounded-[1px]"
                        style={{
                          background: RED,
                          height: `${5 + n * 2}px`,
                          animationDelay: `${n * 0.2}s`,
                        }}
                      />
                    ))}
                  </span>
                ) : (
                  i + 1
                )}
              </span>
              <span
                className="grid size-6 flex-none place-items-center rounded-[5px] text-[11px]"
                style={{ background: t.gradient }}
              >
                {t.emoji}
              </span>
              <span className="truncate">{t.title}</span>
              <span className="truncate text-[11px] text-[#7a7a80]">— {t.artist}</span>
              <span className="ml-auto flex-none text-[10.5px] text-[#7a7a80]">
                {formatSec(t.duration)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const SideItem = ({ icon, label, active }: { icon: string; label: string; active?: boolean }) => (
  <div
    className={cn(
      "flex cursor-pointer items-center gap-2 rounded-[7px] px-2 py-[5px] text-[#d8d8dc] hover:bg-white/[0.05]",
      active && "bg-[rgba(250,45,72,0.18)] font-semibold text-[#ff6b7f]",
    )}
  >
    <span className="w-4 text-center text-[12px]" style={{ color: RED }}>
      {icon}
    </span>
    {label}
  </div>
);
