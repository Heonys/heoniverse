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
}

// [offsetX, offsetY, offsetDepth]
export const sittingOffset: Record<Direction, [number, number, number]> = {
  up: [0, 4, -10],
  down: [0, 4, 1],
  left: [0, -8, 10],
  right: [0, -8, 10],
};
