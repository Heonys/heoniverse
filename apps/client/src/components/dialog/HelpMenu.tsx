import { AppIcon } from "@/icons";

type Props = {
  onPrevious: () => void;
};

export const HelpMenu = ({ onPrevious }: Props) => {
  return (
    <div className="flex flex-col gap-3 p-8">
      <div
        className="absolute left-2 top-2 flex cursor-pointer items-center gap-2 rounded-md p-1 pr-3 transition-colors duration-150 hover:bg-white/10"
        onClick={onPrevious}
      >
        <AppIcon iconName="chevron-left" size={18} />
        <div className="text-xs font-medium">메인메뉴</div>
      </div>

      <div className="flex items-center justify-center gap-2">
        <AppIcon iconName="help" size={23} className="translate-y-0.5" />
        <div className="text-2xl font-bold leading-none tracking-tight">Control Guide</div>
      </div>

      <div className="mt-2 flex flex-col items-start justify-center gap-0.5 text-sm text-[#c2c2c2]">
        <div className="flex w-[540px] flex-col gap-2">
          <div>
            <span className="font-bold text-rose-300">Heoniverse</span>는 HTML5 게임 엔진
            <a
              href="https://phaser.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-0.5 pl-1 text-blue-400 underline"
            >
              Phaser
            </a>
            를 기반으로, 게임 인터페이스를 통해 가상 오피스와 화상회의를 경험할 수 있는 몰입형
            메타버스 협업 플랫폼입니다.
          </div>
          <div>
            <div>
              <a
                href="https://gather.town/"
                target="_blank"
                rel="noopener noreferrer"
                className="pr-1 text-blue-400 underline"
              >
                Gather
              </a>
              라는 메타버스 서비스에서 영감을 받아 개발되었으며, 다른 원격 협업 도구들이 제공하지
              못하는 게임적 몰입감과 자연스러운 소통 경험을 제공하는 것을 목표로 하였습니다.
            </div>
            <div>
              플레이어간 실시간 상호작용과 협업 도구를 제공하며, 직관적인 UI와 다양한 인터랙션
              요소를 통해 더욱 몰입감 있는 환경을 제공하는 것을 목표로 합니다. 사용자들은 마치 같은
              공간에 있는 듯한 경험을 하면서도 게임적 요소를 더해 재밌고 몰입감 있는 환경을
              제공합니다.
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 p-2 pl-4 text-sm text-[#c2c2c2]">
        <ul className="list-inside list-disc space-y-1">
          <li>거리 기반으로 플레이어간 카메라·마이크 자동 연결</li>
          <li>플레이어간 전화, 메시지를 제공하는 스마트폰 UI 지원</li>
          <li>컴퓨터 오브젝트를 통한 사용자 화면공유 지원</li>
          <li>화이트보드 오브젝트를 통한 실시간 아이디어 공유 가능</li>
          <li>하단 메뉴를 통해 미니맵, 조이스틱 등의 편의기능 활성화 가능</li>
        </ul>
      </div>
    </div>
  );
};
