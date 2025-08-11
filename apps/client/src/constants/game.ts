import Adam from "/images/login/Adam_login.png";
import Ash from "/images/login/Ash_login.png";
import Lucy from "/images/login/Lucy_login.png";
import Nancy from "/images/login/Nancy_login.png";
import AdamSprite from "/images/character/adam.png";
import AshSprite from "/images/character/ash.png";
import LucySprite from "/images/character/lucy.png";
import NancySprite from "/images/character/nancy.png";

export const avatars = [
  { name: "adam", img: Adam },
  { name: "ash", img: Ash },
  { name: "lucy", img: Lucy },
  { name: "nancy", img: Nancy },
];

export const spriteAvatars = [
  { name: "adam", sprite: AdamSprite },
  { name: "ash", sprite: AshSprite },
  { name: "lucy", sprite: LucySprite },
  { name: "nancy", sprite: NancySprite },
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
  down: [0, 4, 10],
  left: [0, -8, 10],
  right: [0, -8, 10],
};

export type WASD = {
  W: Phaser.Input.Keyboard.Key;
  S: Phaser.Input.Keyboard.Key;
  A: Phaser.Input.Keyboard.Key;
  D: Phaser.Input.Keyboard.Key;
};

export type ExtendedCursorKeys = Phaser.Types.Input.Keyboard.CursorKeys & WASD;
