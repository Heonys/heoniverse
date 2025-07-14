import Adam from "/images/login/Adam_login.png";
import Ash from "/images/login/Ash_login.png";
import Lucy from "/images/login/Lucy_login.png";
import Nancy from "/images/login/Nancy_login.png";

export const avatars = [
  { name: "adam", img: Adam },
  { name: "ash", img: Ash },
  { name: "lucy", img: Lucy },
  { name: "nancy", img: Nancy },
];

export enum Direction {
  LEFT = "left",
  RIGHT = "right",
  UP = "up",
  DOWN = "down",
}

export enum PlayerBehavior {
  IDLE,
  SITTING,
}

export enum ItemType {
  CHAIR,
  COMPUTER,
  WHITEBOARD,
}

// [offsetX, offsetY, offsetDepth]
export const sittingOffset: Record<Direction, [number, number, number]> = {
  up: [0, 4, -10],
  down: [0, 4, 1],
  left: [0, -8, 10],
  right: [0, -8, 10],
};
