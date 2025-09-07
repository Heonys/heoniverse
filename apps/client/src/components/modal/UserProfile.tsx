import { spriteAvatars } from "@/constants/game";
import { Backdrop } from "./Backdrop";
import { SpriteAnimation } from "@/common/SpriteAnimation";
import { OtherPlayer } from "@/game/characters";
import { cn, spliteAnimKey } from "@/utils";
import { statusColorMap } from "@/constants/common";

type Props = { otherPlayer: OtherPlayer };

export const UserProfile = ({ otherPlayer }: Props) => {
  const { character } = spliteAnimKey(otherPlayer.anims.currentAnim!.key);
  const sprite = spriteAvatars.find((it) => it.name === character)!.sprite;

  return (
    <Backdrop>
      <div className="flex w-full select-none flex-col gap-3">
        <div className="flex flex-col space-y-1.5 text-left">
          <h2 className="text-lg font-semibold leading-none tracking-tight text-white">
            User Profile
          </h2>
          <p className="text-sm text-[#c2c2c2]">플레이어의 프로필을 확인합니다.</p>
        </div>
        <div className="my-4 flex h-40 flex-col items-center gap-2 text-white">
          <div className="flex flex-col gap-1 text-sm">
            <div className="flex flex-col gap-0.5">
              <div className="truncate text-base font-medium text-blue-400">
                {otherPlayer.playerName.text}
                <span className="ml-1 text-xs text-[#888]">{`#${otherPlayer.playerId}`}</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <div
                  className={cn(
                    "size-2.5 rounded-full ring ring-black",
                    statusColorMap[otherPlayer.playerStatus],
                  )}
                />
                <div className="text-xs capitalize">{otherPlayer.playerStatus}</div>
              </div>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-center p-2">
            <SpriteAnimation
              animKey="avatar"
              src={sprite}
              startFrame={18}
              endFrame={23}
              frameWidth={32}
              frameHeight={48}
            />
          </div>
        </div>
      </div>
    </Backdrop>
  );
};
