import { TrafficLights } from "@/components/computer";

export const ScreenSharing = () => {
  return (
    <div className="h-full w-full overflow-hidden rounded-2xl bg-[#1e1e1e]">
      <div className="draggable-area relative top-0 h-7 w-full cursor-move text-center">
        <TrafficLights id="screen-sharing" />
      </div>
    </div>
  );
};
