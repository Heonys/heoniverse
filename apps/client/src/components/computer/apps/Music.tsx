import { TrafficLights } from "@/components/computer";

export const Music = () => {
  return (
    <div className="w-full h-full bg-[#1e1e1e] overflow-hidden rounded-2xl">
      <div className="relative draggable-area text-center top-0 h-7 w-full cursor-move">
        <TrafficLights id="music" />
      </div>
    </div>
  );
};
