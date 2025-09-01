import { TrafficLights } from "@/components/computer";

export const ScreenSharing = () => {
  return (
    <div className="h-full w-full overflow-hidden rounded-2xl bg-[#1e1e1e]">
      <div className="draggable-area relative top-0 h-7 w-full cursor-move text-center">
        <TrafficLights id="screen-sharing" />
      </div>
      <div className="relative h-[calc(100%-28px)] select-none">
        <div className="-translate-1/2 top-2/5 absolute left-1/2 h-[200px] w-[450px] rounded-2xl bg-[#eeeef0]">
          <div className="border-b-2 border-black/10 p-1 text-center text-sm font-semibold text-black/70">
            Screen Sharing
          </div>
          <img src="/icons/screen-sharing.webp" className="no-pixel size-20" alt="screen-sharing" />
          <div className="absolute bottom-3 right-5 flex gap-3">
            <button className="rounded-md border border-black/20 bg-[#f5f5f5] p-1 px-2 text-xs font-semibold text-black/70 shadow-2xl">
              Decline
            </button>
            <button className="rounded-md border border-black/20 bg-[#f5f5f5] p-1 px-2 text-xs font-semibold text-black/70 shadow-2xl">
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
