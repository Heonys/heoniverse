import { useState } from "react";
import { Rnd } from "react-rnd";
import { openApp } from "@/stores/desktopSlice";
import { useAppDispatch, useAppSelector } from "@/hooks";

type Props = {
  id: string;
  title: string;
  component?: React.ReactNode;
  initPosition?: { width: number; height: number };
};

export const AppWindow = ({ id, title, component, initPosition }: Props) => {
  const parent = document.getElementById("desktop-inner");
  const parentWidth = parent?.clientWidth ?? window.innerWidth;
  const parentHeight = parent?.clientHeight ?? window.innerHeight;

  const [position, setPosition] = useState(
    initPosition
      ? {
          x: (parentWidth - initPosition.width) / 2,
          y: (parentHeight - initPosition.height) / 6,
          width: initPosition.width,
          height: initPosition.height,
        }
      : {
          x: (parentWidth - 800) / 2,
          y: (parentHeight - 480) / 6,
          width: 800,
          height: 480,
        },
  );
  const dispatch = useAppDispatch();
  const zIndexMap = useAppSelector((state) => state.desktop.zIndexMap);

  return (
    <Rnd
      id={`desktop-app-${id}`}
      bounds="parent"
      className="overflow-hidden rounded-2xl border border-gray-600 shadow-xl"
      size={{ width: position.width, height: position.height }}
      style={{ zIndex: zIndexMap[id] }}
      position={position}
      minWidth={500}
      minHeight={300}
      dragHandleClassName="draggable-area"
      onMouseDown={() => dispatch(openApp({ id, title }))}
      onDragStop={(_e, d) => {
        setPosition({ ...position, x: d.x, y: d.y });
      }}
      onResizeStop={(_e, _dir, ref, _delta, pos) => {
        setPosition({
          ...position,
          width: parseInt(ref.style.width),
          height: parseInt(ref.style.height),
          ...pos,
        });
      }}
    >
      {component}
    </Rnd>
  );
};
