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
