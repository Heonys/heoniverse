import { MotionValue, useMotionValue, useSpring, useTransform } from "motion/react";
import useRaf from "@rooks/use-raf";

// https://github.com/Renovamen/playground-macos/blob/main/src/components/dock/DockItem.tsx
export const useDockHoverAnimation = (
  mouseX: MotionValue,
  ref: React.RefObject<HTMLImageElement | null>,
  dockSize: number,
  dockMag: number,
) => {
  const distanceLimit = dockSize * 6;
  const distanceInput = [
    -distanceLimit,
    -distanceLimit / (dockMag * 0.65),
    -distanceLimit / (dockMag * 0.85),
    0,
    distanceLimit / (dockMag * 0.85),
    distanceLimit / (dockMag * 0.65),
    distanceLimit,
  ];
  const widthOutput = [
    dockSize,
    dockSize * (dockMag * 0.55),
    dockSize * (dockMag * 0.75),
    dockSize * dockMag,
    dockSize * (dockMag * 0.75),
    dockSize * (dockMag * 0.55),
    dockSize,
  ];

  const distance = useMotionValue(distanceLimit + 1);
  const widthPX = useSpring(useTransform(distance, distanceInput, widthOutput), {
    stiffness: 1700,
    damping: 90,
  });
  const width = useTransform(widthPX, (w) => `${w / 16}rem`);

  useRaf(() => {
    const el = ref.current;
    const mouseXVal = mouseX.get();
    if (el && mouseXVal !== null) {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const delta = mouseXVal - centerX;
      distance.set(delta);
      return;
    }
    distance.set(distanceLimit + 1);
  }, true);

  return { width };
};
