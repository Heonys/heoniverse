import { useState } from "react";
import { Rnd } from "react-rnd";
import { openApp } from "@/stores/desktopSlice";
import { useAppDispatch, useAppSelector } from "@/hooks";

type Props = {
  id: string;
  title: string;
  component?: React.ReactNode;
};

// #f6f6f4 #1e1e1e
export const AppWindow = ({ id, title, component }: Props) => {
  const [position, setPosition] = useState({ x: 337, y: 20, width: 800, height: 480 });
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
