import Phaser from "phaser";

type AnimConfig = {
  key: "left" | "right" | "up" | "down" | "default";
  start: number;
  end: number;
  repeat: number;
  speed?: number;
};

const animationTypes: Record<string, AnimConfig[]> = {
  idle: [
    { key: "right", start: 56, end: 61, repeat: -1, speed: 0.6 },
    { key: "up", start: 62, end: 67, repeat: -1, speed: 0.6 },
    { key: "left", start: 68, end: 73, repeat: -1, speed: 0.6 },
    { key: "down", start: 74, end: 79, repeat: -1, speed: 0.6 },
  ],
  run: [
    { key: "right", start: 112, end: 117, repeat: -1 },
    { key: "up", start: 118, end: 123, repeat: -1 },
    { key: "left", start: 124, end: 129, repeat: -1 },
    { key: "down", start: 130, end: 135, repeat: -1 },
  ],
  sit: [
    { key: "down", start: 74, end: 79, repeat: -1, speed: 0.6 },
    { key: "up", start: 62, end: 67, repeat: -1, speed: 0.6 },
    { key: "right", start: 224, end: 229, repeat: -1, speed: 0.6 },
    { key: "left", start: 230, end: 235, repeat: -1, speed: 0.6 },
  ],
  phone_show: [{ key: "default", start: 336, end: 339, repeat: 0, speed: 0.6 }],
  phone_idle: [{ key: "default", start: 339, end: 344, repeat: -1, speed: 0.6 }],
  punch: [
    { key: "right", start: 728, end: 733, repeat: 0, speed: 0.6 },
    { key: "up", start: 734, end: 739, repeat: 0, speed: 0.6 },
    { key: "left", start: 740, end: 745, repeat: 0, speed: 0.6 },
    { key: "down", start: 746, end: 751, repeat: 0, speed: 0.6 },
  ],
};

const characters = [
  "suit",
  "shark",
  "rapper",
  "police",
  "kimono",
  "jobless",
  "ghost",
  "doctor",
  "bald",
];

export const createCharacterAnims = (anims: Phaser.Animations.AnimationManager) => {
  const animsFrameRate = 15;

  for (const charName of characters) {
    for (const [type, configs] of Object.entries(animationTypes)) {
      for (const config of configs) {
        const animKey =
          config.key === "default" ? `${charName}_${type}` : `${charName}_${type}_${config.key}`;
        anims.create({
          key: animKey,
          frames: anims.generateFrameNames(charName, {
            start: config.start,
            end: config.end,
          }),
          repeat: config.repeat,
          frameRate: animsFrameRate * (config.speed ?? 1),
        });
      }
    }
  }
};
