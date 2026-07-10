// 음악 앱 공용 트랙 목록 — macOS 뮤직·아이폰 목업·모바일 시트가 공유한다.
// 음원(public/audio)·커버(public/images/music) 모두 Pixabay 무료 라이선스(저작권 표기 의무 없음)

export type Track = {
  title: string;
  artist: string;
  album: string;
  duration: number; // seconds
  cover: string;
  gradient: string; // 플레이어 배경 틴트용
  src: string;
};

export const TRACKS: Track[] = [
  {
    title: "Wonders of the Earth",
    artist: "Grand_Project",
    album: "Morning Office",
    duration: 150,
    cover: "/images/music/wonders-of-the-earth.jpg",
    gradient: "linear-gradient(140deg,#6d6ff0,#9a5bf0 55%,#d05bd0)",
    src: "/audio/wonders-of-the-earth.mp3",
  },
  {
    title: "Alone",
    artist: "BoDleasons",
    album: "Morning Office",
    duration: 93,
    cover: "/images/music/alone.jpg",
    gradient: "linear-gradient(140deg,#2d4a6d,#243a5f 60%,#141f38)",
    src: "/audio/alone.mp3",
  },
  {
    title: "Running Night",
    artist: "Alex MakeMusic",
    album: "After Hours",
    duration: 112,
    cover: "/images/music/running-night.jpg",
    gradient: "linear-gradient(140deg,#3d3a8a,#4a2b6f 60%,#2a1f48)",
    src: "/audio/running-night.mp3",
  },
  {
    title: "Focus Beats",
    artist: "SigmaMusicArt",
    album: "After Hours",
    duration: 123,
    cover: "/images/music/focus-beats.jpg",
    gradient: "linear-gradient(140deg,#4a7a6d,#3a5f5c 60%,#22383d)",
    src: "/audio/focus-beats.mp3",
  },
];

export const ALBUMS = [...new Set(TRACKS.map((t) => t.album))];

export const formatSec = (s: number) =>
  `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
