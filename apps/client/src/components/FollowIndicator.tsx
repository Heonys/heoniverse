import { useAppSelector, useGame } from "@/hooks";
import { AppIcon } from "@/icons";

// 따라가는 중 표시 — 이동 로직은 LocalPlayer, 여기선 redux following만 읽어 그린다.
export const FollowIndicator = () => {
  const { getLocalPlayer } = useGame();
  const following = useAppSelector((s) => s.user.following);

  if (!following) return null;

  return (
    <div className="fixed left-1/2 top-3 z-[55] flex -translate-x-1/2 select-none items-center gap-2 rounded-full border border-white/10 bg-[rgba(20,26,40,0.92)] py-1.5 pl-3.5 pr-1.5 text-[12.5px] text-white shadow-[0_12px_28px_-12px_rgba(0,0,0,0.6)] backdrop-blur-md">
      <AppIcon iconName="move" size={14} className="text-accent-hi" />
      <span>
        <b className="font-semibold">{following.name}</b> 따라가는 중
      </span>
      <span className="text-text-faint">· 이동하면 해제</span>
      <button
        className="ml-0.5 grid size-5 cursor-pointer place-items-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
        onClick={() => getLocalPlayer().stopFollow()}
      >
        <AppIcon iconName="x-mark" size={14} />
      </button>
    </div>
  );
};
