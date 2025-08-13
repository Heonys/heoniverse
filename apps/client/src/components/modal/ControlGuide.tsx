import { Backdrop } from "./Backdrop";
import { Kbd, KeyboardUI } from "./KeyboardUI";

export const ControlGuide = () => {
  return (
    <Backdrop>
      <div className="flex w-full flex-col items-center gap-5">
        <div className="flex w-full flex-col space-y-1.5 text-left">
          <h2 className="text-lg font-semibold leading-none tracking-tight text-white">
            Control Guide
          </h2>
          <p className="text-sm text-[#c2c2c2]">기본 조작키 안내</p>
        </div>
        <div className="mx-auto">
          <KeyboardUI />
        </div>
        <div className="flex select-none flex-col gap-1.5 text-sm text-[#c2c2c2]">
          <div className="flex gap-0.5">
            <Kbd>W</Kbd>
            <Kbd>A</Kbd>
            <Kbd>S</Kbd>
            <Kbd>D</Kbd>
            <div>또는 방향키로 캐릭터 조작</div>
          </div>
          <div className="flex gap-1">
            <Kbd>E</Kbd>
            <div>다양한 인터랙션 오브젝트와 상호작용</div>
          </div>
          <div className="flex gap-1">
            <Kbd>Enter</Kbd>
            <div>또는 좌측 하단의 아이콘을 눌러 채팅창 열기</div>
          </div>
          <div className="flex gap-1">
            <Kbd>Esc</Kbd>
            <div>채팅창 또는 팝업창 닫기</div>
          </div>
        </div>
      </div>
    </Backdrop>
  );
};
