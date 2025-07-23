import { useMotionValue } from "motion/react";
import { appsData } from "@/constants/dockItems";
import { DockItem } from "./DockItem";

export function Dock() {
  const mouseX = useMotionValue<number | null>(null);
  const dockSize = 50;
  const dockMag = 2;

  return (
    <div className="absolute inset-x-0 bottom-2 flex justify-center select-none">
      <ul
        className="flex space-x-2 px-2 backdrop-blur-2xl bg-white/20 border border-neutral-400/40 rounded-xl shadow-2xl"
        onMouseMove={(e) => mouseX.set(e.nativeEvent.x)}
        onMouseLeave={() => mouseX.set(null)}
        style={{ height: `${(dockSize + 15) / 16}rem` }}
      >
        {appsData.map(({ id, img, title }) => (
          <DockItem
            key={id}
            id={id}
            img={img}
            title={title}
            mouseX={mouseX}
            dockSize={dockSize}
            dockMag={dockMag}
          />
        ))}
      </ul>
    </div>
  );
}
