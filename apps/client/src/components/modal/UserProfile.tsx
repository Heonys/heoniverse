import { spriteAvatars } from "@/constants/game";
import { Backdrop } from "./Backdrop";
import { SpriteAnimation } from "@/common/SpriteAnimation";

type Props = { id: string; name: string; texure: string };

export const UserProfile = ({ id, name, texure }: Props) => {
  const sprite = spriteAvatars.find((it) => it.name === texure)!.sprite;

  return (
    <Backdrop>
      <div className="flex w-full select-none flex-col gap-3">
        <div className="flex flex-col space-y-1.5 text-left">
          <h2 className="text-lg font-semibold leading-none tracking-tight text-white">
            User Profile
          </h2>
          <p className="text-sm text-[#c2c2c2]">플레이어의 프로필을 확인합니다.</p>
        </div>
        <div className="grid h-36 grid-cols-2 text-white">
          <div className="flex items-center justify-center px-2">
            <SpriteAnimation
              animKey="avatar"
              src={sprite}
              startFrame={18}
              endFrame={23}
              frameWidth={32}
              frameHeight={48}
            />
          </div>
          <div className="flex flex-col gap-1 pt-2 text-sm">
            <div>
              <div className="font-medium text-blue-400">Name</div>
              <div className="truncate p-1 text-sm">
                {name}
                <span className="ml-1 text-xs text-[#888]">{`#${id}`}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Backdrop>
  );
};
