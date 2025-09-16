import { useMotionValue } from "motion/react";
import { appsData } from "@/constants/dockItems";
import { DockItem } from "./DockItem";

export function Dock() {
  const mouseX = useMotionValue<number | null>(null);
  const dockSize = 50;
  const dockMag = 2;

  return (
    <div className="absolute inset-x-0 bottom-2 flex select-none justify-center">
      <ul
        className="flex h-16 space-x-2 rounded-xl border border-neutral-400/40 bg-white/20 px-2 shadow-2xl backdrop-blur-2xl"
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(null)}
      >
        {appsData.map(({ id, img, title, component }) => (
          <DockItem
            key={id}
            id={id}
            img={img}
            title={title}
            mouseX={mouseX}
            dockSize={dockSize}
            dockMag={dockMag}
            available={!!component}
          />
        ))}
      </ul>
    </div>
  );
}
