import SuitIcon from "/icons/character/suit.png";
import KimonoIcon from "/icons/character/kimono.png";
import BaldIcon from "/icons/character/bald.png";
import GhostIcon from "/icons/character/ghost.png";
import JoblessIcon from "/icons/character/jobless.png";
import PoliceIcon from "/icons/character/police.png";
import RapperIcon from "/icons/character/rapper.png";
import SharkIcon from "/icons/character/shark.png";
import SuferIcon from "/icons/character/sufer.png";

import SuitSprite from "/images/character/idle/suit.png";
import KimonoSprite from "/images/character/idle/kimono.png";
import BaldSprite from "/images/character/idle/bald.png";
import GhostSprite from "/images/character/idle/ghost.png";
import JoblessSprite from "/images/character/idle/jobless.png";
import PoliceSprite from "/images/character/idle/police.png";
import RapperSprite from "/images/character/idle/rapper.png";
import SharkSprite from "/images/character/idle/shark.png";
import SuferSprite from "/images/character/idle/sufer.png";

export const spriteAvatars = [
  { name: "suit", sprite: SuitSprite },
  { name: "kimono", sprite: KimonoSprite },
  { name: "shark", sprite: SharkSprite },
  { name: "bald", sprite: BaldSprite },
  { name: "sufer", sprite: SuferSprite },
  { name: "ghost", sprite: GhostSprite },
  { name: "rapper", sprite: RapperSprite },
  { name: "jobless", sprite: JoblessSprite },
  { name: "police", sprite: PoliceSprite },
];

export const avatarIcons = [
  { name: "suit", icon: SuitIcon },
  { name: "kimono", icon: KimonoIcon },
  { name: "shark", icon: SharkIcon },
  { name: "bald", icon: BaldIcon },
  { name: "sufer", icon: SuferIcon },
  { name: "ghost", icon: GhostIcon },
  { name: "rapper", icon: RapperIcon },
  { name: "jobless", icon: JoblessIcon },
  { name: "police", icon: PoliceIcon },
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
  up: [0, -12, -10],
  down: [0, -6, 10],
  left: [-2, -18, 10],
  right: [2, -18, 10],
};

export type WASD = {
  W: Phaser.Input.Keyboard.Key;
  S: Phaser.Input.Keyboard.Key;
  A: Phaser.Input.Keyboard.Key;
  D: Phaser.Input.Keyboard.Key;
};

export type ExtendedCursorKeys = Phaser.Types.Input.Keyboard.CursorKeys & WASD;
