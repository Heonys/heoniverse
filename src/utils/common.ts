import { twMerge } from "tailwind-merge";
import { clsx, ClassValue } from "clsx";

export function cn(...args: ClassValue[]) {
  return twMerge(clsx(...args));
}

export function openURL(url: string) {
  const canOpenNewTab = window.open(url, "_blank");

  if (!canOpenNewTab) {
    window.location.href = url;
  }
}
