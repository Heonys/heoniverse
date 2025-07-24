import { AppIcon } from "@/icons";
import { TrafficLights } from "../TrafficLights";

export const Messages = () => {
  return (
    <div className="w-full h-full bg-[#1e1e1e]/75 backdrop-blur-sm overflow-hidden rounded-2xl">
      <div className="relative grid grid-cols-3 draggable-area text-center top-0 h-7 w-full cursor-move">
        <div className="relative">
          <TrafficLights id="messages" />
        </div>
        <div className="col-span-2 bg-[#1e1e1e]" />
      </div>
      <div className="w-full h-[calc(100%-28px)] grid grid-cols-3 select-none over">
        <div className="w-full flex flex-col gap-1 p-2 text-white">
          <div className="relative px-2 py-1 rounded-md bg-gray-100/10 h-15 flex items-center gap-3 cursor-pointer">
            <div className="text-[10px] bg-gray-500 rounded-full size-9 flex justify-center items-center">
              <div className="font-semibold">Public</div>
            </div>
            <div className="text-xs">메시지가 없습니다</div>
            <div className="absolute right-1 top-1 text-[10px] text-white/60">오후 6:25</div>
            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-blue-500 rounded-full size-2" />
          </div>
        </div>
        <div className="col-span-2 bg-[#1e1e1e] text-white size-full flex flex-col">
          {/* header */}
          <div className="flex items-center h-9 border-b border-gray-100/20 shadow-2xl px-2">
            <div className="flex gap-2 items-center text-sm text-white/90">
              <AppIcon iconName="edit" size={18} />
              <div className="font-semibold">Messages</div>
            </div>
            <div className="flex flex-auto justify-end gap-3 px-1">
              <AppIcon iconName="video" size={18} />
              <AppIcon iconName="info" size={18} />
            </div>
          </div>
          {/* messages */}
          <div className="text-sm p-3 flex flex-col flex-1 overflow-auto">
            <div className="flex flex-wrap p-1">
              <span className=" text-white/90 bg-[#3e3e3e] rounded-xl p-1 px-3">
                안녕하세요 메시지 입니다 1...
              </span>
            </div>
            <div className="flex flex-wrap p-1">
              <span className=" text-white/90 bg-[#3e3e3e] rounded-xl p-1 px-3">
                안녕하세요 메시지 입니다 2...
              </span>
            </div>
            <div className="flex flex-wrap p-2 justify-end">
              <span className="text-white/85 bg-[#0084ff] rounded-xl p-1 px-3">
                네 저도 안녕하세요
              </span>
            </div>
          </div>
          {/* input */}
          <form className="h-10 text-white flex items-center text-sm px-3 gap-3">
            <div className="bg-[#3e3e3e] text-white/60 rounded-full p-1 flex justify-center items-center">
              <AppIcon iconName="plus" size={12} />
            </div>
            <div className="relative w-full">
              <input
                type="text"
                className="bg-[#3e3e3e] rounded-xl py-1 px-3 outline-none w-full pr-9"
                placeholder="Message"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                <AppIcon iconName="voice" size={17} />
              </span>
            </div>
            <AppIcon iconName="emoji" size={20} />
          </form>
        </div>
      </div>
    </div>
  );
};
