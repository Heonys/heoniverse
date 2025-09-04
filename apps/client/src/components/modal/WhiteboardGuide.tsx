import { Backdrop } from "./Backdrop";

export const WhiteboardGuide = () => {
  return (
    <Backdrop className="max-w-lg">
      <div className="flex w-full select-none flex-col items-center gap-5">
        <div className="flex w-full flex-col space-y-1.5 text-left">
          <h2 className="text-lg font-semibold leading-none tracking-tight text-white">
            Whiteboard Guide
          </h2>
          <p className="text-sm text-[#c2c2c2]">화이트보드 사용 안내</p>
        </div>
        <div className="flex flex-col gap-3 text-sm text-[#e0e0e0]">
          <div>
            <span className="font-bold">Honiverse</span> 에서 상호작용할 수 있는 오브젝트 중 하나인
            화이트보드는 실시간으로 플레이어들간 아이디어를 시각화하고 공유할 수 있도록 제공하고
            있으며,{" "}
            <a
              href="https://github.com/excalidraw/excalidraw"
              target="_blank"
              className="pr-1 text-blue-400 underline"
            >
              Excalidraw
            </a>
            에디터를 활용하여 Honiverse 환경과 통합되어 있습니다.
          </div>
        </div>
        <div></div>
      </div>
    </Backdrop>
  );
};
