import { AppIcon } from "@/icons";
import { TrafficLights } from "../TrafficLights";

export const Safari = () => {
  return (
    <div className="w-full h-full bg-[#1e1e1e] overflow-hidden rounded-2xl">
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
                  className="h-6 w-64 pl-8 pr-2 py-1 rounded font-normal text-sm bg-[#1e1e1e] text-white outline-none"
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

        <div className="p-6">
          <div className="pt-8 px-4">
            <div className="text-white font-medium text-xl">즐겨 찾기</div>
            <div className="mt-3 grid grid-flow-row grid-cols-8"></div>
          </div>
          <div className="pt-5 px-4">
            <div className="text-white font-medium text-xl">개인 정보 보호 리포트</div>
            <div className="h-16 w-full mt-4 grid grid-cols-8 shadow-2xl rounded-xl text-sm bg-gray-50/70">
              <div className="col-start-1 col-span-1 flex items-center justify-center space-x-2">
                <AppIcon iconName="shield" size={18} />
                <span className="text-xl">20</span>
              </div>
              <div className="col-start-2 col-span-7 flex items-center px-2">
                지난 7일 동안 Safari가 사용자를 프로파일링하려는 20개의 트래커를 차단했으며, 알려진
                트래커에게서 사용자의 IP주소를 가렸습니다.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
