import { useEffect, useState } from "react";
import { useAppSelector, useGame } from "@/hooks";
import { Backdrop } from "./Backdrop";
import { AvatarIcon } from "@/components";
import { Player } from "@/game/characters";
import { Status } from "@heoniverse/shared";
import { statusColorMap, statusLabelMap } from "@/constants/common";
import { eventEmitter } from "@/game/events";
import { cn } from "@/utils";

export const JoinedUsers = () => {
  const { getLocalPlayer, getOtherPlayerById } = useGame();
  const { otherPlayersName } = useAppSelector((state) => state.user);
  const roomName = useAppSelector((state) => state.room.name);

  const player = getLocalPlayer();
  const users = Object.entries(otherPlayersName).map(([id, name]) => ({ id, name }));

  return (
    <Backdrop className="max-w-[420px]">
      <div className="w-full select-none">
        <h2 className="text-[17px] font-semibold tracking-[-0.01em] text-white">플레이어 목록</h2>
        <p className="text-text-dim mt-1 text-xs">
          {roomName} · {users.length + 1}명 접속 중
        </p>

        {/* 나 — 인디고 틴트로 구분 */}
        <div className="border-accent/25 bg-accent/10 mt-4 flex items-center gap-3 rounded-xl border px-3 py-2.5">
          <AvatarIcon
            texture={player.playerTexture}
            status={player.playerStatus}
            className="size-10"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[13.5px] font-semibold text-white">
              <span className="truncate">{player.playerName.text}</span>
              <span className="bg-accent flex-none rounded-[5px] px-1.5 py-px text-[9.5px] font-bold text-white">
                나
              </span>
            </div>
            <StatusLine status={player.playerStatus} />
          </div>
          <div className="text-text-faint font-retro ml-auto flex-none text-[11px]">{`#${player.playerId.slice(0, 6)}`}</div>
        </div>

        <div className="text-text-faint mb-2 mt-4 text-[11.5px] font-semibold">함께 있는 사람</div>
        <div className="flex max-h-[300px] flex-col gap-1.5 overflow-y-auto">
          {users.length === 0 && (
            <div className="text-text-dim flex h-16 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.028] text-[12.5px]">
              아무도 없어요
            </div>
          )}
          {users.map(({ id }) => {
            const other = getOtherPlayerById(id);
            return other && <UserListRow key={id} player={other} />;
          })}
        </div>
      </div>
    </Backdrop>
  );
};

function StatusLine({ status }: { status: Status }) {
  return (
    <div className="text-text-dim mt-0.5 flex items-center gap-1.5 text-[11px]">
      <span className={cn("size-1.5 rounded-full", statusColorMap[status])} />
      {statusLabelMap[status]}
    </div>
  );
}

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
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.028] px-3 py-2.5">
      <AvatarIcon texture={playerTexture} status={status} className="size-10" />
      <div className="min-w-0">
        <div className="truncate text-[13.5px] font-semibold text-white">{playerName.text}</div>
        <StatusLine status={status} />
      </div>
      <div className="text-text-faint font-retro ml-auto flex-none text-[11px]">{`#${playerId.slice(0, 6)}`}</div>
    </div>
  );
}
