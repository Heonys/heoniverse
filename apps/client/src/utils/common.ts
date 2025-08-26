import { format, isToday } from "date-fns";
import { ko } from "date-fns/locale";
import { twMerge } from "tailwind-merge";
import { clsx, ClassValue } from "clsx";
import { Direction, sittingOffset } from "@/constants/game";
import { JoystickMovement, MovementInput } from "@/components";
import { RoomType } from "@heoniverse/shared";

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
  "bg-green-400",
  "bg-emerald-400",
  "bg-teal-400",
  "bg-cyan-400",
  // "bg-sky-400",
  "bg-blue-400",
  "bg-indigo-400",
  "bg-violet-400",
  "bg-purple-400",
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

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return isToday(date)
    ? format(date, "a h:mm", { locale: ko })
    : format(date, "MMM d일 (eee)", { locale: ko });
}

export function formatElapsedTime(time: number) {
  const minutes = `${Math.floor(time / 60)}`.padStart(2, "0");
  const seconds = `${time % 60}`.padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function getJoystickDirection(joystickMovement?: JoystickMovement) {
  const joystic = { up: false, down: false, left: false, right: false };
  if (joystickMovement?.isMoving) {
    joystic.up = joystickMovement.movement.up;
    joystic.down = joystickMovement.movement.down;
    joystic.left = joystickMovement.movement.left;
    joystic.right = joystickMovement.movement.right;
  }
  return joystic;
}

export function angle2Movement(angle: number): MovementInput {
  angle = (angle + 360) % 360;

  const movement = {
    left: false,
    right: false,
    up: false,
    down: false,
  };

  if (angle >= 22.5 && angle < 67.5) {
    movement.right = true;
    movement.up = true;
  } else if (angle >= 67.5 && angle < 112.5) {
    movement.up = true;
  } else if (angle >= 112.5 && angle < 157.5) {
    movement.up = true;
    movement.left = true;
  } else if (angle >= 157.5 && angle < 202.5) {
    movement.left = true;
  } else if (angle >= 202.5 && angle < 247.5) {
    movement.left = true;
    movement.down = true;
  } else if (angle >= 247.5 && angle < 292.5) {
    movement.down = true;
  } else if (angle >= 292.5 && angle < 337.5) {
    movement.down = true;
    movement.right = true;
  } else {
    movement.right = true;
  }

  return movement;
}

export function isCustomRoom(roomName: string) {
  return roomName === RoomType.CUSTOM;
}

export function shuffle(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
