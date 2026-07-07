import { AppIcon, IconNames } from "@/icons";
import { spriteAvatars } from "@/constants/game";
import { cn } from "@/utils";
import { Panel } from "./primitives";
import { MiniTilemap } from "./MiniTilemap";

type Props = {
  roomName: string;
  roomDescription: string;
  roomIcon: IconNames;
  onBack: () => void;
  avatar: string;
  onAvatarChange: (avatar: string) => void;
  nickname: string;
  onNicknameChange: (nickname: string) => void;
  nickError: string | null;
  joining: boolean;
  onEnter: () => void;
};

// STEP 2 카드: 캐릭터 & 닉네임 — 선택한 방 컨텍스트 + 조작 가능한 미니맵 + 로스터 + 입장
export const CharacterSetupCard = ({
  roomName,
  roomDescription,
  roomIcon,
  onBack,
  avatar,
  onAvatarChange,
  nickname,
  onNicknameChange,
  nickError,
  joining,
  onEnter,
}: Props) => {
  return (
    <Panel className="w-[560px] p-[26px] px-7">
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          onEnter();
        }}
      >
        {/* pre-join이라 방 선택으로 자유롭게 되돌아갈 수 있다 */}
        <button
          type="button"
          onClick={onBack}
          className="bg-surface-2 text-text-dim hover:text-app-text absolute left-[18px] top-[18px] grid size-[30px] cursor-pointer place-items-center rounded-[9px] border border-white/[0.07] transition-colors hover:bg-[#24252b]"
        >
          <AppIcon iconName="chevron-left" size={16} />
        </button>

        <div className="mb-4 flex flex-col items-center gap-1">
          <div className="flex items-center gap-2 text-[22px] font-semibold tracking-[-0.01em] text-white">
            <AppIcon iconName={roomIcon} size={20} className="text-sky-soft" />
            {roomName}
          </div>
          <div className="text-text-dim text-[12.5px]">{roomDescription}</div>
        </div>

        {/* 좌: 조작해보는 무대 / 우: 캐릭터 선택 — 고르면 바로 왼쪽 무대에 반영된다 */}
        <div className="flex gap-3.5">
          <MiniTilemap
            avatar={avatar}
            nickname={nickname}
            className="h-[216px] w-[300px] flex-none"
          />
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="text-text-dim mb-2 text-xs font-semibold">캐릭터 선택</div>
            <div className="grid flex-1 grid-cols-3 content-start gap-1.5">
              {spriteAvatars.map(({ name, sprite }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => onAvatarChange(name)}
                  className={cn(
                    "bg-surface grid aspect-square cursor-pointer place-items-center overflow-hidden rounded-[9px] border border-white/[0.07] transition",
                    "hover:-translate-y-0.5 hover:border-white/20",
                    avatar === name && "border-accent shadow-[0_0_0_2px_rgba(86,101,214,0.36)]",
                  )}
                >
                  <i
                    className="block h-10 w-8 scale-[0.82] bg-no-repeat [background-position:-576px_-2px] [image-rendering:pixelated]"
                    style={{ backgroundImage: `url(${sprite})` }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className="text-text-dim mb-2 block text-xs font-semibold" htmlFor="entry-nick">
            닉네임 <span className="text-coral font-bold">*</span>
          </label>
          <div className="relative">
            <AppIcon
              iconName="user-cirlce"
              size={17}
              className="text-accent-hi absolute left-3.5 top-1/2 -translate-y-1/2"
            />
            <input
              id="entry-nick"
              className={cn(
                "border-accent/40 bg-surface text-app-text h-12 w-full rounded-xl border-[1.5px] pl-[42px] pr-3.5 text-[15px] outline-none transition",
                "placeholder:text-text-faint focus:border-accent focus:shadow-[0_0_0_3px_rgba(86,101,214,0.36)]",
                nickError && "border-coral/70",
              )}
              placeholder="닉네임을 입력해 주세요 (2~6자)"
              maxLength={20}
              value={nickname}
              onChange={(event) => onNicknameChange(event.target.value)}
            />
          </div>
          <div
            className={cn("mt-[7px] text-[11.5px]", nickError ? "text-coral" : "text-text-faint")}
          >
            {nickError ?? "입장하면 아바타 머리 위에 이 이름표가 떠요"}
          </div>
        </div>

        <button
          type="submit"
          disabled={joining}
          className={cn(
            "bg-accent mt-[18px] inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[13px] text-[15px] font-semibold text-white",
            "shadow-[0_6px_14px_-11px_rgba(86,101,214,0.36),inset_0_1px_0_rgba(255,255,255,0.12)] transition",
            "hover:brightness-[1.06] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-70",
          )}
        >
          {joining ? "입장 중..." : "입장하기"}
        </button>
      </form>
    </Panel>
  );
};
