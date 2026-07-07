import { Backdrop } from "./Backdrop";
import { useModal } from "@/hooks";
import { spriteAvatars } from "@/constants/game";

type Props = {
  nickname: string;
};

const ghostSprite = spriteAvatars.find(({ name }) => name === "ghost")!.sprite;

// 첫 방문 1회만 뜨는 환영 — 인게임 NPC(고스트 캐릭터)가 레트로 게임 대사창으로 인사한다
export const WelcomeModal = ({ nickname }: Props) => {
  const { hideModal } = useModal();

  return (
    <Backdrop className="from-panel-top to-panel-bot w-[392px] max-w-[94vw] select-none rounded-[22px] border-white/10 bg-gradient-to-b p-6 px-[22px] pb-5 shadow-[0_40px_90px_-28px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-none">
      {/* NPC가 서서 말을 건다 */}
      <div className="relative h-[108px]">
        <div className="absolute bottom-0 left-1/2 h-[9px] w-10 -translate-x-1/2 rounded-full bg-black/35 blur-[3px]" />
        <div
          className="animate-widle absolute bottom-[3px] left-1/2 -ml-4 h-[54px] w-8 origin-bottom scale-[1.9] bg-no-repeat [image-rendering:pixelated]"
          style={{ backgroundImage: `url(${ghostSprite})` }}
        />
      </div>

      {/* 레트로 게임 대사창 */}
      <div className="relative mt-[15px] rounded-lg border-2 border-white/[0.22] bg-[#121319] px-[15px] pb-[13px] pt-[15px] shadow-[0_0_0_2px_#121319,inset_0_0_0_1px_rgba(0,0,0,0.6)]">
        <div className="bg-accent font-retro absolute -top-[11px] left-3 rounded-[5px] px-[9px] py-[3px] text-[11px] tracking-[0.5px] text-white shadow-[0_3px_8px_-3px_rgba(0,0,0,0.5)]">
          NPC
        </div>
        <div className="font-retro text-[13.5px] leading-[1.75] tracking-[0.2px] text-[#e8eaf0]">
          어서 와, {nickname}. 여긴 Heoniverse —{" "}
          <b className="text-voice font-normal">가까이 가면 목소리가 들리는</b> 곳이지. 천천히
          둘러보라구.
        </div>
        <div className="animate-retro-blink font-retro text-accent-hi absolute bottom-2 right-[11px] text-xs">
          ▼
        </div>
      </div>

      <button
        onClick={hideModal}
        className="bg-accent mx-auto mt-[17px] flex h-11 w-fit cursor-pointer items-center justify-center rounded-[13px] px-[30px] text-sm font-semibold text-white shadow-[0_6px_14px_-11px_rgba(86,101,214,0.36),inset_0_1px_0_rgba(255,255,255,0.12)] transition hover:brightness-[1.06] active:translate-y-px"
      >
        둘러보기 시작
      </button>
      <div className="text-text-faint mt-3 text-center text-[11px]">
        막히면 우하단 &quot;조작 가이드&quot;를 눌러봐
      </div>
    </Backdrop>
  );
};
