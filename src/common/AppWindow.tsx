import { useState } from "react";
import { Rnd } from "react-rnd";

type Props = {
  id: string;
  component?: React.ReactNode;
};

// #f6f6f4
// #1e1e1e
export const AppWindow = ({ id, component }: Props) => {
  const [position, setPosition] = useState({ x: 340, y: 15, width: 650, height: 430 });

  return (
    <Rnd
      id={`desktop-app-${id}`}
      bounds="parent"
      className="overflow-hidden rounded-2xl border-gray-500 border shadow-xl"
      size={{ width: position.width, height: position.height }}
      position={position}
      dragHandleClassName="draggable-area"
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
