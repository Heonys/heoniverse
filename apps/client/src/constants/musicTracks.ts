// 음악 앱 공용 트랙 목록 — macOS 뮤직·아이폰 목업·모바일 시트가 공유한다.
// TODO(오디오 연결): public/audio에 음원을 넣고 각 트랙의 src를 채운 뒤,
// 가짜 타이머 대신 <audio> 엘리먼트의 timeupdate로 진행을 구동하면 실제 재생이 된다.

export type Track = {
  title: string;
  artist: string;
  album: string;
  duration: number; // seconds
  emoji: string;
  gradient: string;
  src?: string; // 예: "/audio/pixel-sunrise.mp3"
};

export const TRACKS: Track[] = [
  {
    title: "Pixel Sunrise",
    artist: "Lo-fi for Heoniverse",
    album: "Morning Office",
    duration: 167,
    emoji: "🌅",
    gradient: "linear-gradient(140deg,#6d6ff0,#9a5bf0 55%,#d05bd0)",
  },
  {
    title: "Coffee Break",
    artist: "Chill Office Beats",
    album: "Morning Office",
    duration: 143,
    emoji: "☕",
    gradient: "linear-gradient(140deg,#e8a04e,#d0685b 60%,#9a4e6d)",
  },
  {
    title: "Night Shift",
    artist: "Midnight Coding",
    album: "After Hours",
    duration: 201,
    emoji: "🌙",
    gradient: "linear-gradient(140deg,#3d4a8a,#2b355f 60%,#1a1f38)",
  },
  {
    title: "Whiteboard Session",
    artist: "Focus Tape",
    album: "After Hours",
    duration: 188,
    emoji: "📝",
    gradient: "linear-gradient(140deg,#3f8a6d,#2b5f4c 60%,#1a382d)",
  },
];

export const ALBUMS = [...new Set(TRACKS.map((t) => t.album))];

export const formatSec = (s: number) =>
  `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
