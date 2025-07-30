import { AppIcon } from "@/icons";
import { TrafficLights } from "../TrafficLights";

export const Safari = () => {
  return (
    <div className="w-full h-full overflow-hidden rounded-2xl bg-[#1e1e1e]">
      <div className="relative draggable-area text-center top-0 h-7 w-full cursor-move">
        <TrafficLights id="safari" />
      </div>
      <div className="size-full select-none">
        <div className="h-10 grid grid-cols-[1fr_auto_1fr] items-center bg-[#2d2d2d]">
          <div className="flex px-2 items-center gap-1">
            <button className="p-1 px-1.5 bg-[#4c4c4c] rounded-sm shadow-2xl">
              <AppIcon iconName="chevron-left" color="white" />
            </button>
            <button className="p-1 px-1.5 bg-[#4c4c4c] rounded-sm shadow-2xl">
              <AppIcon iconName="chevron-right" color="white" />
            </button>
            <button className="ml-3 p-1 px-2 bg-[#4c4c4c] rounded-sm shadow-2xl">
              <AppIcon iconName="sidebar" color="white" />
            </button>
          </div>
          <div className="flex justify-center items-center">
            <div className="flex items-center gap-2">
              <button className="p-1 px-2 bg-[#4c4c4c] rounded-sm shadow-2xl">
                <AppIcon iconName="shield" color="white" />
              </button>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">
                  <AppIcon iconName="search" color="white" />
                </span>
                <input
                  type="text"
                  className="h-7 w-64 pl-8 p-2 rounded font-normal text-sm bg-[#1e1e1e] text-white outline-none"
                  placeholder="Search or enter website name"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 px-4">
            <button className="p-1 px-2 bg-[#4c4c4c] rounded-sm shadow-2xl">
              <AppIcon iconName="shared" color="white" />
            </button>
            <button className="p-1 px-2 bg-[#4c4c4c] rounded-sm shadow-2xl">
              <AppIcon iconName="copy" color="white" />
            </button>
          </div>
        </div>

        <div className="p-5">
          <div className="mt-4 px-4">
            <div className="text-white/90 font-medium text-lg">즐겨찾기</div>
            <div className="mt-3 flex gap-3 px-2">
              <div className="h-28 flex flex-col">
                <div className="size-16 mx-auto rounded-md overflow-hidden bg-white/90">
                  <img className="no-pixel scale-[80%]" src="/icons/apple.png" alt="2png" />
                </div>
                <span className="mt-2 mx-auto text-[10px] text-white">Apple</span>
              </div>
              <div className="h-28 flex flex-col">
                <div className="size-16 mx-auto rounded-md overflow-hidden bg-white/90">
                  <img className="no-pixel" src="/icons/google.png" alt="2png" />
                </div>
                <span className="mt-2 mx-auto text-[10px] text-white">Google</span>
              </div>
              <div className="h-28 flex flex-col">
                <div className="size-16 mx-auto rounded-md overflow-hidden bg-white/90">
                  <img className="no-pixel scale-105" src="/icons/github.png" alt="2png" />
                </div>
                <span className="mt-2 mx-auto text-[10px] text-white">Github</span>
              </div>
            </div>
          </div>
          <div className="px-4">
            <div className="text-white/90 font-medium text-lg">개인정보 보호 리포트</div>
            <div className="h-16 w-full mt-4 flex items-center shadow-2xl rounded-xl text-sm bg-[#2d2d2d] text-white/90">
              <div className="px-3 ml-2 my-auto flex items-center justify-center gap-1.5 opacity-80">
                <AppIcon iconName="shield" size={20} />
              </div>
              <div className="flex items-center px-2 text-xs">
                지난 7일 동안 Safari가 사용자를 프로파일링하려는 8개의 트래커를 차단했습니다.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
