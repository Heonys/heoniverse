import { twMerge } from "tailwind-merge";
import { clsx, ClassValue } from "clsx";
import { Direction, sittingOffset } from "@/constants";

export function cn(...args: ClassValue[]) {
  return twMerge(clsx(...args));
}

export function openURL(url: string) {
  const canOpenNewTab = window.open(url, "_blank");

  if (!canOpenNewTab) {
    window.location.href = url;
  }
}

export function spliteAnimKey(key: string) {
  const splited = key.split("_");
  return {
    character: splited[0],
    state: splited[1],
    direction: splited[2] as Direction,
    sittingOffset: sittingOffset[splited[2] as Direction],
  };
}

export const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  timeStyle: "short",
  dateStyle: "short",
});

const TAILWIND_COLORS = [
  "bg-red-400",
  // "bg-orange-400",
  "bg-amber-400",
  // "bg-yellow-400",
  "bg-lime-400",
  // "bg-green-400",
  "bg-emerald-400",
  // "bg-teal-400",
  "bg-cyan-400",
  // "bg-sky-400",
  "bg-blue-400",
  // "bg-indigo-400",
  "bg-violet-400",
  // "bg-purple-400",
  "bg-fuchsia-400",
  // "bg-pink-400",
  "bg-rose-400",
  // "bg-slate-400",
];

export function pickColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash % TAILWIND_COLORS.length);
  return TAILWIND_COLORS[index];
}
