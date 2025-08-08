import { useAppSelector, useGame } from "@/hooks";
import { Backdrop } from "./Backdrop";

export const JoinedUsers = () => {
  const { localPlayer } = useGame();
  const { otherPlayersName } = useAppSelector((state) => state.user);
  const users = [...otherPlayersName.entries()].map(([id, name]) => ({ id, name }));

  return (
    <Backdrop>
      <div className="flex flex-col w-full max-w-sm rounded-lg select-none">
        <div className="flex flex-col space-y-1.5 text-left w-full">
          <h2 className="text-lg font-semibold leading-none tracking-tight text-white">
            Joined Users
          </h2>
          <p className="text-sm text-[#c2c2c2]">{`현재 방에 접속한 인원 총 ${users.length + 1}명`}</p>
        </div>

        {/* 유저 리스트 */}
        <div className="flex flex-col gap-1 text-white mt-2">
          <div className="flex items-center justify-between border-b border-white/10 p-1">
            <div>
              <span className="text-base font-semibold">{localPlayer.playerName.text}</span>
              <span className="ml-1 text-xs text-[#888]">{`#${localPlayer.playerId}`}</span>
            </div>
          </div>
          {users.map(({ id, name }) => (
            <div key={id} className="flex items-center justify-between p-1">
              <div>
                <span className="text-base font-medium">{name}</span>
                <span className="ml-2 text-xs text-[#888]">{`#${id}`}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Backdrop>
  );
};
