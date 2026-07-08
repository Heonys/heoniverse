import { useEffect, useState } from "react";
import { spriteAvatars } from "@/constants/game";
import { Backdrop } from "./Backdrop";
import { SpriteAnimation } from "@/common/SpriteAnimation";
import { useAppSelector, useGame, useModal } from "@/hooks";
import { cn, splitAnimKey } from "@/utils";
import { statusColorMap, statusLabelMap } from "@/constants/common";
import { eventEmitter } from "@/game/events";
import { AppIcon, IconNames } from "@/icons";
import { Status } from "@heoniverse/shared";
import { Network } from "@/service";
import { OtherPlayer } from "@/game/characters";

type Props = { playerId: string };

type Activity = { label: string; icon: IconNames };

// 지금 뭐 하는 중인지 — 전부 이미 동기화되는 상태에서 파생(새 저장 없음). 우선순위대로 판정.
function deriveActivity(player: OtherPlayer, network: Network, npcBusyBy: string): Activity {
  if (npcBusyBy === player.playerId) return { label: "AI 도우미와 대화 중", icon: "wand" };

  const state = network.room?.state;
  if (state) {
    let onComputer = false;
    state.computers.forEach((computer) => {
      if (computer.connectedUser.has(player.playerId)) onComputer = true;
    });
    if (onComputer) return { label: "컴퓨터 사용 중", icon: "display" };

    let onWhiteboard = false;
    state.whiteboards.forEach((whiteboard) => {
      if (whiteboard.connectedUser.has(player.playerId)) onWhiteboard = true;
    });
    if (onWhiteboard) return { label: "화이트보드 작업 중", icon: "draw" };
  }

  const animKey = player.anims.currentAnim?.key;
  if (animKey && splitAnimKey(animKey).state === "sit")
    return { label: "의자에 앉음", icon: "chair" };

  return { label: "둘러보는 중", icon: "move" };
}

export const UserProfile = ({ playerId }: Props) => {
  const { getOtherPlayerById, network } = useGame();
  const { hideModal } = useModal();
  const npcBusyBy = useAppSelector((s) => s.ai.npcBusyBy);
  const otherPlayer = getOtherPlayerById(playerId);
  const [status, setStatus] = useState<Status>(otherPlayer?.playerStatus ?? "available");
  const [activity, setActivity] = useState<Activity>({ label: "둘러보는 중", icon: "move" });

  // 프로필을 보는 도중 해당 플레이어가 퇴장하면 모달을 닫는다
  useEffect(() => {
    const handler = ({ sessionId }: { sessionId: string }) => {
      if (sessionId === playerId) hideModal();
    };
    eventEmitter.on("OTHER_PLAYER_LEFT", handler);
    return () => eventEmitter.off("OTHER_PLAYER_LEFT", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerId]);

  // 상태 변화를 프로필에도 라이브 반영
  useEffect(() => {
    const handler = ({ id, status }: { id: string; status: Status }) => {
      if (id === playerId) setStatus(status);
    };
    eventEmitter.on("RENDER_TO_STATUS", handler);
    return () => eventEmitter.off("RENDER_TO_STATUS", handler);
  }, [playerId]);

  // 활동은 이벤트가 여럿(앉기/컴퓨터/화이트보드/NPC)이라 가벼운 폴링으로 재파생
  useEffect(() => {
    if (!otherPlayer) return;
    const update = () => setActivity(deriveActivity(otherPlayer, network, npcBusyBy));
    update();
    const id = setInterval(update, 800);
    return () => clearInterval(id);
  }, [otherPlayer, network, npcBusyBy]);

  useEffect(() => {
    if (!otherPlayer) hideModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherPlayer]);

  if (!otherPlayer) return null;

  const { character } = splitAnimKey(otherPlayer.anims.currentAnim!.key);
  const sprite = spriteAvatars.find((it) => it.name === character)!.sprite;

  return (
    <Backdrop className="max-w-[360px]">
      {/* 다른 모달과 같은 좌측 상단 타이틀 헤더 — 없으면 붕 떠 보임 */}
      <h2 className="text-[17px] font-semibold tracking-[-0.01em] text-white">프로필</h2>
      <div className="mt-6 flex w-full select-none flex-col items-center">
        {/* 큰 캐릭터 초상화 (히어로) */}
        <div className="flex h-36 w-32 items-center justify-center overflow-hidden rounded-2xl border-2 border-white/[0.14] bg-[#121319] shadow-[0_0_0_3px_rgba(16,17,24,0.7),inset_0_0_26px_rgba(86,102,214,0.18)]">
          <div className="scale-[1.2]">
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

        {/* 이름 · #id */}
        <div className="mt-4 flex max-w-full items-baseline gap-2.5">
          <span className="truncate text-[21px] font-bold tracking-[-0.01em] text-white">
            {otherPlayer.playerName.text}
          </span>
          <span className="text-text-faint font-retro flex-none text-[12px]">{`#${otherPlayer.playerId.slice(0, 6)}`}</span>
        </div>

        {/* 상태 · 활동 칩 */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-[12.5px] font-medium text-[#e8eaf0]">
            <span className={cn("size-2 rounded-full", statusColorMap[status])} />
            {statusLabelMap[status]}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-[12.5px] font-medium text-[#e8eaf0]">
            <AppIcon iconName={activity.icon} size={15} className="text-accent-hi" />
            {activity.label}
          </span>
        </div>
      </div>
    </Backdrop>
  );
};
