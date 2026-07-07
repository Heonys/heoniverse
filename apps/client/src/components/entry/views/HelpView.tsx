import { useState } from "react";
import { spriteAvatars } from "@/constants/game";
import { ViewHead } from "../primitives";

type Props = {
  onBack: () => void;
};

const suitSprite = spriteAvatars.find(({ name }) => name === "suit")!.sprite;
const VOICE_BARS = [7, 13, 9, 14, 7];

// 시그니처(거리 기반 음성)를 설명하는 대신 장면으로 보여준다:
// amy가 걸어 들어와 멈추면 그제서야 둘 사이에 음성 웨이브가 이어진다
export const HelpView = ({ onBack }: Props) => {
  // key 리마운트로 CSS 애니메이션(걸어옴 → 연결)을 처음부터 다시 재생
  const [sceneKey, setSceneKey] = useState(0);

  return (
    <div className="flex flex-col">
      <ViewHead title="Heoniverse란" onBack={onBack} />

      <div
        key={sceneKey}
        onClick={() => setSceneKey((key) => key + 1)}
        className="relative mt-3 h-[158px] cursor-pointer overflow-hidden rounded-[14px] bg-[url('/images/background/menu-floor.png')] bg-repeat shadow-[inset_0_0_0_1px_rgba(0,0,0,0.35),inset_0_-34px_44px_-26px_rgba(10,14,26,0.55),inset_0_20px_36px_-24px_rgba(255,255,255,0.05)] [background-size:64px_64px] [image-rendering:pixelated]"
      >
        {/* 내 캐릭터: 서서 오른쪽(다가오는 amy 쪽)을 본다 */}
        <NameTag className="bottom-[128px] left-[96px]">heon</NameTag>
        <div className="absolute bottom-5 left-[88px] h-2.5 w-11 rounded-full bg-black/30 blur-[3px]" />
        <div
          className="animate-idle-right absolute bottom-[22px] left-[94px] h-[54px] w-8 origin-bottom scale-[2] bg-no-repeat [image-rendering:pixelated]"
          style={{ backgroundImage: `url(${suitSprite})` }}
        />

        {/* amy가 도착해야 이어지는 음성 웨이브 */}
        <div className="animate-vshow absolute bottom-[78px] left-[calc(50%-14px)] flex h-4 items-end gap-[3px] opacity-0">
          {VOICE_BARS.map((height, index) => (
            <i
              key={index}
              className="entry-vbar bg-voice w-[3px] rounded-[2px] shadow-[0_0_6px_rgba(1,220,162,0.55)]"
              style={{ height, animationDelay: `${index * 0.15}s` }}
            />
          ))}
        </div>

        {/* amy: 오른쪽에서 걸어 들어와 멈춘다 (entire 시트 run → idle) */}
        <div className="animate-approach absolute bottom-[22px] right-[88px]">
          <div className="absolute -bottom-0.5 -left-1.5 h-2.5 w-11 rounded-full bg-black/30 blur-[3px]" />
          <div className="help-walker-body relative h-16 w-8 origin-bottom scale-[2] bg-[url('/images/character/entire/kimono.png')] bg-no-repeat [background-size:1792px_1280px] [image-rendering:pixelated]" />
          {/* 스프라이트가 scale(2)로 위로 자라므로, 확대된 머리 위(heon과 같은 높이)에 오도록 bottom 기준으로 배치 */}
          <NameTag className="bottom-[106px] left-1/2 -translate-x-1/2">amy</NameTag>
        </div>
      </div>

      <div className="text-app-text mt-3 text-center text-[13px] font-medium">
        가까이 가면, <b className="text-accent-hi font-semibold">목소리가 이어져요</b>
      </div>

      <p className="text-text-dim mt-2.5 text-[12.5px] leading-[1.7]">
        Gather에서 영감을 받아 만든 몰입형 협업 공간이에요. 원격 협업 도구가 주지 못하는{" "}
        <b className="text-app-text font-semibold">게임적 몰입감과 자연스러운 소통</b>, 실시간
        상호작용과 다양한 인터랙션으로{" "}
        <b className="text-app-text font-semibold">마치 같은 공간에 있는 듯한 경험</b>을 지향해요.
      </p>
      <div className="text-text-faint mt-3 border-t border-white/[0.06] pt-3 text-[11.5px] leading-[1.6]">
        데스크탑 환경에 최적화되어 있어 모바일에서는 일부 기능이 제한됩니다.
      </div>
    </div>
  );
};

const NameTag = ({ className, children }: { className: string; children: string }) => {
  return (
    <div className={`absolute flex items-center gap-1 whitespace-nowrap ${className}`}>
      <span className="bg-voice size-[7px] rounded-full border-[1.5px] border-black" />
      <span className="font-retro text-xs tracking-[0.5px] text-black">{children}</span>
    </div>
  );
};
