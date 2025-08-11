import { spriteAvatars } from "@/constants/game";
import { Backdrop } from "./Backdrop";
import { SpriteAnimation } from "@/common/SpriteAnimation";

type Props = { id: string; name: string; texure: string };

export const UserProfile = ({ id, name, texure }: Props) => {
  const sprite = spriteAvatars.find((it) => it.name === texure)!.sprite;

  return (
    <Backdrop>
      <div className="flex flex-col gap-3 select-none w-full">
        <div className="flex flex-col space-y-1.5 text-left">
          <h2 className="text-lg font-semibold leading-none tracking-tight text-white">
            User Profile
          </h2>
          <p className="text-sm text-[#c2c2c2]">플레이어의 프로필을 확인합니다.</p>
        </div>
        <div className="text-white grid grid-cols-2 h-36">
          <div className="flex justify-center items-center px-2">
            <SpriteAnimation
              animKey="avatar"
              src={sprite}
              startFrame={18}
              endFrame={23}
              frameWidth={32}
              frameHeight={48}
            />
          </div>
          <div className="text-sm flex flex-col gap-1 pt-2">
            <div>
              <div className="text-blue-400 font-medium">Name</div>
              <div className="text-sm p-1 truncate">
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
