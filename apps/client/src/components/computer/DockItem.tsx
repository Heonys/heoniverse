import { motion, MotionValue } from "motion/react";
import { useRef } from "react";
import { useAppDispatch, useAppSelector, useDockHoverAnimation } from "@/hooks";
import { Tooltip } from "react-tooltip";
import { openApp } from "@/stores/desktopSlice";
import { cn } from "@/utils";

type Props = {
  id: string;
  title: string;
  img: string;
  mouseX: MotionValue;
  dockSize: number;
  dockMag: number;
};

export function DockItem({ id, img, mouseX, dockSize, dockMag, title }: Props) {
  const ref = useRef<HTMLImageElement>(null);
  const { width } = useDockHoverAnimation(mouseX, ref, dockSize, dockMag);
  const dispatch = useAppDispatch();
  const showApps = useAppSelector((state) => state.desktop.showApps);

  const handleClick = () => {
    dispatch(openApp({ id, title }));
  };

  return (
    <li className="relative mb-1 flex flex-col justify-end">
      <div className="relative">
        <motion.img
          className="no-pixel"
          ref={ref}
          src={img}
          draggable={false}
          style={{ width, willChange: "width" }}
          data-tooltip-id="dock-item-tooltip"
          data-tooltip-content={title}
          onClick={handleClick}
        />
      </div>
      <Tooltip
        id="dock-item-tooltip"
        place="top"
        className="!select-none !rounded !px-2 !py-1 !text-white !shadow-lg"
      />
      <div
        className={cn("mx-auto size-1 rounded-full bg-[#F3F4F6]", showApps[id] ? "" : "invisible")}
      />
    </li>
  );
}
