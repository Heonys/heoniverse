import { useState } from "react";
import { Rnd } from "react-rnd";
import { TrafficLights } from "@/components/computer";

type Props = {
  id: string;
  component?: React.ReactNode;
};

export const AppWindow = ({ id, component }: Props) => {
  const [position, setPosition] = useState({ x: 400, y: 15, width: 700, height: 500 });

  return (
    <Rnd
      id={`desktop-app-${id}`}
      bounds="parent"
      className="overflow-hidden rounded-xl bg-[#1e1e1e] border-gray-500 border shadow-xl"
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
      <div className="relative draggable-area text-center top-0 h-7 w-full cursor-move">
        <TrafficLights id={id} />
      </div>
      <div className="w-full h-full">{component}</div>
    </Rnd>
  );
};
