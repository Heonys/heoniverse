import { useAppSelector, useGame } from "@/hooks";
import { Backdrop } from "./Backdrop";
import { AvatarIcon } from "../AvatarIcon";

export const JoinedUsers = () => {
  const { getLocalPlayer, getOtherPlayerById } = useGame();
  const { otherPlayersName } = useAppSelector((state) => state.user);

  const player = getLocalPlayer();
  const users = [...otherPlayersName.entries()].map(([id, name]) => ({ id, name }));

  return (
    <Backdrop className="max-w-lg">
      <div className="flex w-full select-none flex-col rounded-lg">
        <div className="flex w-full flex-col space-y-1.5 text-left">
          <h2 className="text-lg font-semibold leading-none tracking-tight text-white">
            Joined Users
          </h2>
          <p className="text-sm text-[#c2c2c2]">현재 방에 접속한 인원</p>
        </div>
        <div className="mt-3 flex flex-col gap-1 text-white">
          <div className="border-b border-white/10 p-1">
            <UserListRow
              id={player.playerId}
              name={player.playerName.text}
              texture={player.playerTexture}
            />
          </div>
          <div className="grid grid-cols-2 p-1">
            {users.map(({ id, name }) => {
              const player = getOtherPlayerById(id);
              return (
                <UserListRow
                  key={id}
                  id={id}
                  name={name}
                  texture={player?.playerTexture ?? "adam"}
                />
              );
            })}
          </div>
        </div>
      </div>
    </Backdrop>
  );
};

function UserListRow({ id, name, texture }: { id: string; name: string; texture: string }) {
  return (
    <div className="flex items-center gap-2">
      <AvatarIcon texture={texture} className="size-9" />
      <div>
        <span className="text-base font-medium text-blue-400">{name}</span>
        <span className="ml-1 text-xs text-[#888]">{`#${id}`}</span>
      </div>
    </div>
  );
}
