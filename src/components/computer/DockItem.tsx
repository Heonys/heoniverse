import { motion, MotionValue } from "motion/react";
import { useRef } from "react";
import { useDockHoverAnimation } from "@/hooks";
import { Tooltip } from "react-tooltip";

type Props = {
  title: string;
  img: string;
  mouseX: MotionValue;
  dockSize: number;
  dockMag: number;
};

export function DockItem({ img, mouseX, dockSize, dockMag, title }: Props) {
  const ref = useRef<HTMLImageElement>(null);
  const { width } = useDockHoverAnimation(mouseX, ref, dockSize, dockMag);

  return (
    <li className="relative flex flex-col justify-end mb-1">
      <motion.img
        className="no-pixel"
        ref={ref}
        src={img}
        alt={title}
        title={title}
        draggable={false}
        style={{ width, willChange: "width" }}
        data-tooltip-id="dock-item-tooltip"
        data-tooltip-content={title}
      />
      <Tooltip
        id="dock-item-tooltip"
        data-tooltip-variant="dark"
        place="top"
        className="!text-white !rounded !px-2 !py-1 !shadow-lg !select-none"
      />
    </li>
  );
}
