import { TrafficLights } from "@/components/computer";
import { useState } from "react";
import { Rnd } from "react-rnd";

type Props = {
  id: string;
};

export const AppWindow = ({ id }: Props) => {
  const [position, setPosition] = useState({ x: 200, y: 200, width: 700, height: 500 });

  /* 
  TODO: 리사이징 화면 밖으로 넘어감 
  */

  return (
    <div className="h-full">
      <Rnd
        bounds="parent"
        className="overflow-hidden rounded-lg bg-[#1B1B1D] border-gray-500 border shadow-xl"
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
        <div className="w-full h-full">{/* <VSCode /> */}</div>
      </Rnd>
    </div>
  );
};
