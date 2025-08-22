import { useEffect, useState } from "react";
import { useAppSelector, useGame } from "@/hooks";
import { Backdrop } from "./Backdrop";
import { AvatarIcon } from "@/components";
import { Player } from "@/game/characters";
import { Status } from "@heoniverse/shared";
import { eventEmitter } from "@/game/events";

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
            <div className="flex items-center gap-2">
              <AvatarIcon
                texture={player.playerTexture}
                status={player.playerStatus}
                className="size-9"
              />
              <div>
                <span className="text-base font-medium text-blue-400">
                  {player.playerName.text}
                </span>
                <span className="ml-1 text-xs text-[#888]">{`#${player.playerId}`}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 p-1">
            {users.map(({ id }) => {
              const player = getOtherPlayerById(id);
              return player && <UserListRow key={id} player={player} />;
            })}
          </div>
        </div>
      </div>
    </Backdrop>
  );
};

function UserListRow({ player }: { player: Player }) {
  const { playerTexture, playerName, playerId, playerStatus } = player;
  const [status, setStatus] = useState<Status>(playerStatus);

  useEffect(() => {
    const handler = ({ id, status }: { id: string; status: Status }) => {
      if (playerId === id) setStatus(status);
    };
    eventEmitter.on("RENDER_TO_STATUS", handler);
    return () => eventEmitter.off("RENDER_TO_STATUS", handler);
  }, [playerId]);

  return (
    <div className="flex items-center gap-2">
      <AvatarIcon texture={playerTexture} status={status} className="size-9" />
      <div>
        <span className="text-base font-medium text-blue-400">{playerName.text}</span>
        <span className="ml-1 text-xs text-[#888]">{`#${playerId}`}</span>
      </div>
    </div>
  );
}
