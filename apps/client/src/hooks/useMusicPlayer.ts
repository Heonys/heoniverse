import { useSyncExternalStore } from "react";
import { TRACKS } from "@/constants/musicTracks";

const DEFAULT_VOLUME = 0.1;

// 재생 상태·오디오는 모듈 싱글턴 — 아이폰·macOS·모바일 시트가 하나의 재생을 공유하고(연속성),
// 플레이어 화면을 닫아도 백그라운드 재생이 유지된다
type PlayerState = {
  trackIndex: number;
  playing: boolean;
  seconds: number;
  volume: number;
};

let audio: HTMLAudioElement | null = null;
let state: PlayerState = { trackIndex: -1, playing: false, seconds: 0, volume: DEFAULT_VOLUME };
const listeners = new Set<() => void>();

function setState(patch: Partial<PlayerState>) {
  state = { ...state, ...patch };
  listeners.forEach((listener) => listener());
}

function ensureAudio() {
  if (audio) return audio;
  audio = new Audio();
  audio.volume = state.volume;
  audio.addEventListener("timeupdate", () => setState({ seconds: audio!.currentTime }));
  audio.addEventListener("ended", () => playTrack((state.trackIndex + 1) % TRACKS.length));
  return audio;
}

function playTrack(index: number) {
  const player = ensureAudio();
  player.src = TRACKS[index].src;
  setState({ trackIndex: index, seconds: 0, playing: true });
  player.play().catch(() => setState({ playing: false }));
}

function pick(index: number) {
  if (index === state.trackIndex && audio) {
    audio.currentTime = 0;
    setState({ seconds: 0, playing: true });
    audio.play().catch(() => setState({ playing: false }));
    return;
  }
  playTrack(index);
}

function toggle() {
  if (state.trackIndex < 0) return playTrack(0);
  const player = ensureAudio();
  if (state.playing) {
    player.pause();
    setState({ playing: false });
  } else {
    setState({ playing: true });
    player.play().catch(() => setState({ playing: false }));
  }
}

function step(delta: number) {
  if (state.trackIndex < 0) return;
  const next = (state.trackIndex + delta + TRACKS.length) % TRACKS.length;
  if (state.playing) {
    playTrack(next);
  } else {
    ensureAudio().src = TRACKS[next].src;
    setState({ trackIndex: next, seconds: 0 });
  }
}

function seek(sec: number) {
  if (!audio || state.trackIndex < 0) return;
  const duration = TRACKS[state.trackIndex].duration;
  audio.currentTime = Math.min(Math.max(sec, 0), duration);
  setState({ seconds: audio.currentTime });
}

function setVolume(value: number) {
  const clamped = Math.min(Math.max(value, 0), 1);
  if (audio) audio.volume = clamped;
  setState({ volume: clamped });
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
const getSnapshot = () => state;

export function useMusicPlayer() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot);
  const track = snapshot.trackIndex >= 0 ? TRACKS[snapshot.trackIndex] : null;
  return { track, ...snapshot, pick, toggle, step, seek, setVolume };
}
