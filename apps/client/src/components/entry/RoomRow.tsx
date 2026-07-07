import { useMemo } from "react";
import { AppIcon } from "@/icons";
import { spriteAvatars } from "@/constants/game";
import { cn } from "@/utils";
import { CustomRoom } from "./types";

// 로비 메타데이터엔 참여자의 아바타 정보가 없다(인원 수뿐) — 스택은 roomId 시드 기반
// 의사랜덤 "장식"이다. 실제 얼굴을 띄우려면 서버가 occupant 아바타를 push해야 한다(후속 과제).
function seededAvatars(roomId: string, count: number) {
  let seed = 0;
  for (const ch of roomId) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  const pool = [...spriteAvatars];
  const picked: typeof pool = [];
  const size = Math.min(count, 3, pool.length);
  for (let i = 0; i < size; i++) {
    seed = (seed * 1103515245 + 12345) >>> 0;
    picked.push(pool.splice(seed % pool.length, 1)[0]);
  }
  return picked;
}

type Props = {
  room: CustomRoom;
  onClick?: () => void;
  className?: string;
};

// 커스텀 방 목록 행 · 비밀번호 뷰의 방 요약에 함께 쓰는 공용 행
export const RoomRow = ({ room, onClick, className }: Props) => {
  const stack = useMemo(
    () => seededAvatars(room.roomId, room.clients),
    [room.roomId, room.clients],
  );

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.028] px-3 py-[11px]",
        onClick && "hover:border-accent/45 group cursor-pointer transition hover:bg-white/[0.055]",
        className,
      )}
    >
      <div className="flex flex-none">
        {stack.map(({ name, sprite }, index) => (
          <span
            key={name}
            className={cn(
              "border-panel-bot bg-surface grid h-[31px] w-[27px] place-items-center overflow-hidden rounded-lg border-[1.5px]",
              index > 0 && "-ml-2",
            )}
          >
            <i
              className="block h-10 w-8 scale-[0.72] bg-no-repeat [background-position:-576px_-2px] [image-rendering:pixelated]"
              style={{ backgroundImage: `url(${sprite})` }}
            />
          </span>
        ))}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-[5px]">
          <span
            className="text-app-text truncate text-sm font-semibold"
            title={room.metadata?.name}
          >
            {room.metadata?.name}
          </span>
          {room.metadata?.hasPassword && (
            <AppIcon iconName="lock" size={12} className="flex-none text-[#f0a838]" />
          )}
        </div>
        <div
          className="text-text-faint mt-0.5 truncate text-[11.5px]"
          title={room.metadata?.description}
        >
          {room.metadata?.description}
        </div>
      </div>

      <div className="text-text-dim inline-flex flex-none items-center gap-1 rounded-full bg-white/[0.06] px-[9px] py-1 text-[11.5px] font-bold">
        <AppIcon iconName="people" size={12} className="opacity-80" />
        {room.clients}
      </div>

      {onClick && (
        <AppIcon
          iconName="chevron-right"
          size={16}
          className="text-text-faint flex-none -translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-70"
        />
      )}
    </div>
  );
};
