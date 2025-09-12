import { Backdrop } from "./Backdrop";
import { Kbd } from "./KeyboardUI";

export const ControlGuide = () => {
  return (
    <Backdrop className="max-w-lg">
      <div className="flex w-full select-none flex-col items-center gap-5">
        <div className="flex w-full flex-col space-y-1.5 text-left">
          <h2 className="text-lg font-semibold leading-none tracking-tight text-white">
            Control Guide
          </h2>
          <p className="text-sm text-[#c2c2c2]">기본 조작 안내</p>
        </div>
        <div className="flex flex-col gap-2 p-2 text-xs text-[#c2c2c2]">
          <div className="flex items-center gap-0.5">
            <Kbd>W</Kbd>
            <Kbd>A</Kbd>
            <Kbd>S</Kbd>
            <Kbd>D</Kbd>
            <div className="ml-1">또는 방향키 및 조이스틱으로 캐릭터 조작</div>
          </div>
          <div className="flex items-center gap-2">
            <Kbd>E</Kbd>
            <div>의자 오브젝트와 상호작용</div>
          </div>
          <div className="flex items-center gap-2">
            <Kbd>R</Kbd>
            <div>컴퓨터, 화이트보드와 같은 인터랙션 오브젝트와 상호작용</div>
          </div>
          <div className="flex items-center gap-2">
            <Kbd>Space</Kbd>
            <div>캐릭터 펀치 애니메이션</div>
          </div>
          <div className="flex items-center gap-2">
            <Kbd>Enter</Kbd>
            <div>스마트폰 채팅창 열기</div>
          </div>
          <div className="flex items-center gap-2">
            <Kbd>Esc</Kbd>
            <div>채팅창 또는 팝업창 닫기</div>
          </div>
        </div>
        <div className="flex flex-col gap-2 p-2 pl-4 text-sm text-[#c2c2c2]">
          <ul className="list-inside list-disc space-y-1">
            <li>거리 기반으로 플레이어간 카메라·마이크 자동 연결</li>
            <li>플레이어간 전화, 메시지를 제공하는 스마트폰 UI 지원</li>
            <li>컴퓨터 오브젝트를 통한 사용자 화면공유 지원</li>
            <li>화이트보드 오브젝트를 통한 실시간 아이디어 공유 가능</li>
            <li>하단 메뉴를 통해 미니맵 및 조이스틱 등의 편의기능 활성화 가능</li>
          </ul>
        </div>
      </div>
    </Backdrop>
  );
};
