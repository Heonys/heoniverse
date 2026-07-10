import { useState } from "react";
import {
  IoPlay,
  IoPause,
  IoPlaySkipBack,
  IoPlaySkipForward,
  IoVolumeOff,
  IoVolumeHigh,
  IoEllipsisHorizontal,
} from "react-icons/io5";
import { BsChatQuote } from "react-icons/bs";
import { MdAirplay } from "react-icons/md";
import { HiMiniQueueList } from "react-icons/hi2";
import { TRACKS, formatSec } from "@/constants/musicTracks";
import { useMusicPlayer } from "@/hooks/useMusicPlayer";
import { StatusBar, BackChevron } from "./StatusBar";
import { cn } from "@/utils";

type Props = {
  // 목업에서는 ‹홈으로, 모바일 시트에서는 생략(시트 자체 닫기가 있음)
  onHome?: () => void;
};

// 아이폰 목업(253px)과 모바일 시트 양쪽에서 재사용 — 컨테이너 크기에 의존하지 말 것.
export const MusicPlayer = ({ onHome }: Props) => {
  const {
    track,
    trackIndex,
    playing,
    seconds,
    volume,
    pick: pickTrack,
    toggle,
    step,
    seek,
    setVolume,
  } = useMusicPlayer();
  const [listOpen, setListOpen] = useState(false);

  const pick = (index: number) => {
    pickTrack(index);
    setListOpen(false);
  };
  const seekByClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!track) return;
    const rect = e.currentTarget.getBoundingClientRect();
    seek(((e.clientX - rect.left) / rect.width) * track.duration);
  };
  const volumeByClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setVolume((e.clientX - rect.left) / rect.width);
  };

  return (
    <div
      className="relative flex size-full flex-col overflow-hidden transition-[background] duration-500"
      style={{
        background: track
          ? `linear-gradient(rgba(8,8,14,0.35), rgba(8,8,14,0.65)), ${track.gradient}`
          : "linear-gradient(160deg,#2a2438,#16141f)",
      }}
    >
      {onHome && (
        <div className="relative flex flex-none flex-col text-white">
          <StatusBar tone="dark" />
          <div className="relative h-7">
            <BackChevron color="#ffffff" onClick={onHome} />
          </div>
        </div>
      )}

      <div className={cn("flex min-h-0 flex-1 flex-col px-5 pb-4", onHome ? "pt-0" : "pt-11")}>
        {/* 드래그 핸들 */}
        {!onHome && <div className="mx-auto mb-3 h-1 w-9 flex-none rounded-full bg-white/35" />}

        {track ? (
          <>
            {/* 앨범 아트 */}
            <img
              src={track.cover}
              alt={track.title}
              draggable={false}
              className={cn(
                "aspect-square w-full flex-none rounded-xl object-cover shadow-[0_18px_44px_-12px_rgba(0,0,0,0.55)] transition-transform duration-300",
                !playing && "scale-[0.82]",
              )}
            />

            <div className="mt-4 flex flex-none items-center justify-between">
              <div className="min-w-0">
                <div className="truncate text-[15px] font-extrabold text-white">{track.title}</div>
                <div className="truncate text-[12px] text-white/55">{track.artist}</div>
              </div>
              <div className="grid size-6 flex-none cursor-pointer place-items-center rounded-full bg-white/[0.18] text-white">
                <IoEllipsisHorizontal size={13} />
              </div>
            </div>

            {/* 진행바 */}
            <div className="mt-3 flex-none">
              <div className="h-1 cursor-pointer rounded-full bg-white/25" onClick={seekByClick}>
                <div
                  className="h-full rounded-full bg-white/85"
                  style={{ width: `${(seconds / track.duration) * 100}%` }}
                />
              </div>
              <div className="mt-1 flex justify-between text-[9.5px] text-white/50">
                <span>{formatSec(seconds)}</span>
                <span>-{formatSec(track.duration - seconds)}</span>
              </div>
            </div>

            {/* 컨트롤 */}
            <div className="mt-3 flex flex-none items-center justify-center gap-10 text-white">
              <button className="cursor-pointer" onClick={() => step(-1)} aria-label="이전 곡">
                <IoPlaySkipBack size={24} />
              </button>
              <button className="cursor-pointer" onClick={toggle} aria-label="재생/일시정지">
                {playing ? <IoPause size={34} /> : <IoPlay size={34} />}
              </button>
              <button className="cursor-pointer" onClick={() => step(1)} aria-label="다음 곡">
                <IoPlaySkipForward size={24} />
              </button>
            </div>

            {/* 볼륨 */}
            <div className="mt-4 flex flex-none items-center gap-2 text-white/60">
              <IoVolumeOff size={13} />
              <div
                className="relative h-1 flex-1 cursor-pointer rounded-full bg-white/25 py-0 before:absolute before:-inset-y-1.5 before:inset-x-0 before:content-['']"
                onClick={volumeByClick}
              >
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-white/80 after:absolute after:-right-1.5 after:top-1/2 after:size-3 after:-translate-y-1/2 after:rounded-full after:bg-white after:content-['']"
                  style={{ width: `${volume * 100}%` }}
                />
              </div>
              <IoVolumeHigh size={13} />
            </div>
          </>
        ) : (
          <div className="grid flex-1 place-items-center text-center text-[12.5px] text-white/60">
            <div>
              재생 중인 음악이 없습니다
              <br />
              <button
                className="mt-3 cursor-pointer rounded-full bg-white/[0.18] px-4 py-2 text-[12px] text-white"
                onClick={() => pick(0)}
              >
                재생 시작
              </button>
            </div>
          </div>
        )}

        {/* 하단 아이콘 — 가사·AirPlay는 장식 */}
        <div className="mt-auto flex flex-none items-center justify-evenly pt-3 text-white/70">
          <span className="opacity-50" aria-label="가사 (준비 중)">
            <BsChatQuote size={16} />
          </span>
          <span className="opacity-50" aria-label="AirPlay (준비 중)">
            <MdAirplay size={17} />
          </span>
          <button
            className="cursor-pointer"
            onClick={() => setListOpen(true)}
            aria-label="재생목록"
          >
            <HiMiniQueueList size={17} />
          </button>
        </div>
      </div>

      {/* 트랙 목록 시트 */}
      {listOpen && (
        <div className="absolute inset-x-0 bottom-0 top-[32%] z-10 flex flex-col rounded-t-[18px] border-t border-white/[0.12] bg-[#18181e]/[0.97]">
          <div className="flex flex-none items-center justify-between px-4 pb-2 pt-3 text-[13px] font-bold text-white">
            트랙 목록
            <button
              className="cursor-pointer font-normal text-white/55"
              onClick={() => setListOpen(false)}
            >
              닫기
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-2 pb-3">
            {TRACKS.map((t, i) => (
              <button
                key={t.title}
                className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-left active:bg-white/[0.07]"
                onClick={() => pick(i)}
              >
                <img
                  src={t.cover}
                  alt={t.title}
                  draggable={false}
                  className="size-9 flex-none rounded-md object-cover"
                />
                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "block truncate text-[12.5px]",
                      i === trackIndex ? "text-[#ff8fa0]" : "text-white",
                    )}
                  >
                    {t.title}
                  </span>
                  <span className="block text-[10.5px] text-white/45">{t.artist}</span>
                </span>
                <span className="flex-none text-[10px] text-white/45">{formatSec(t.duration)}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
