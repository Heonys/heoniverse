import { Backdrop } from "./Backdrop";

export const ComputerGuide = () => {
  return (
    <Backdrop className="max-w-lg">
      <div className="flex w-full select-none flex-col items-center gap-5">
        <div className="flex w-full flex-col space-y-1.5 text-left">
          <h2 className="text-lg font-semibold leading-none tracking-tight text-white">
            Computer Guide
          </h2>
          <p className="text-sm text-[#c2c2c2]">컴퓨터 사용 안내</p>
        </div>
        <div className="flex flex-col gap-3 text-sm text-[#e0e0e0]">
          <div>
            <span className="font-bold">Honiverse</span> 에서 상호작용할 수 있는 오브젝트 중 하나인
            컴퓨터는 사용자에게 MacOS 환경에서 데스크탑을 사용하는 듯한 경험을 제공하면서도
            Honiverse와 통합하여 다양한 기능을 추가하기 위해 만들어졌으며,
            <a
              href="https://github.com/puruvj/macos-web"
              target="_blank"
              className="px-1 text-blue-400 underline"
            >
              macos-web
            </a>
            라는 오픈소스에서 영감을 받았습니다.
          </div>

          <ul className="list-inside list-disc space-y-0.5 text-[#c2c2c2]">
            <li>화면 공유앱으로 다른 사용자들과 화면공유가 가능합니다</li>
            <li>채팅앱을 통해 내부의 채팅과 연동 됩니다</li>
            <li>화면 공유를 진행하는 경우 연결 종료전까지 전원 버튼이 비활성화됩니다</li>
          </ul>
        </div>
        <div></div>
      </div>
    </Backdrop>
  );
};
