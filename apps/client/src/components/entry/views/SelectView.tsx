import { useAppSelector } from "@/hooks";
import { AppIcon } from "@/icons";
import { Condition } from "@/common";
import { ProgressBar } from "@/components/ProgressBar";
import { EntryButton } from "../primitives";
import LogoIcon from "/images/background/logo-icon.webp";

type Props = {
  onPublic: () => void;
  onCustom: () => void;
  onOffline: () => void;
  onHelp: () => void;
};

export const SelectView = ({ onPublic, onCustom, onOffline, onHelp }: Props) => {
  const { lobbyJoined, lobbyStatus, lobbyWaking, totalClients } = useAppSelector(
    (state) => state.room,
  );

  return (
    <div className="flex flex-col items-center">
      <img
        className="no-pixel size-[76px] rounded-[20px] border border-white/[0.12] object-cover shadow-[0_12px_28px_-10px_rgba(0,0,0,0.6)]"
        draggable={false}
        src={LogoIcon}
        alt="Heoniverse"
      />
      <div className="mt-3.5 text-[26px] font-semibold tracking-[-0.02em] text-white">
        Heoniverse
      </div>
      <div className="text-text-dim mt-1 text-center text-[13px]">
        함께 모여 소소하게 즐기고 이야기하는 곳
      </div>

      {/* 연결 상태: 연결됨 → 온라인 수 / 연결 중 → 진행바 / 실패 → 안내 */}
      <Condition condition={lobbyJoined}>
        <div className="bg-surface text-text-dim mt-[13px] inline-flex items-center gap-[7px] rounded-full border border-white/[0.07] py-[5px] pl-[9px] pr-[11px] text-[12.5px]">
          <span className="bg-online size-[7px] rounded-full shadow-[0_0_0_3px_rgba(70,196,124,0.18)]" />
          <b className="text-app-text font-semibold">{Math.max(totalClients - 1, 0)}</b>명 온라인
        </div>
      </Condition>
      <Condition condition={lobbyStatus === "connecting"}>
        <div className="mt-3 w-[240px]">
          <ProgressBar
            message={lobbyWaking ? "서버를 켜는 중... (최대 1분)" : "서버에 연결하는 중..."}
          />
        </div>
      </Condition>
      <Condition condition={lobbyStatus === "failed"}>
        <div className="text-coral mt-3 text-xs">서버에 연결할 수 없습니다</div>
      </Condition>

      <div className="mt-5 flex w-full flex-col gap-2.5">
        {/* 첫 시도가 실패한 뒤부터 오프라인 모드로 빠질 수 있는 탈출구 제공 */}
        <Condition condition={!lobbyJoined && (lobbyStatus === "failed" || lobbyWaking)}>
          <EntryButton variant="secondary" onClick={onOffline}>
            <AppIcon iconName="joystick" size={17} />
            오프라인 모드
          </EntryButton>
        </Condition>
        <EntryButton disabled={!lobbyJoined} onClick={onPublic}>
          <AppIcon iconName="public" size={17} />
          공개 방 입장하기
        </EntryButton>
        <EntryButton variant="secondary" disabled={!lobbyJoined} onClick={onCustom}>
          <AppIcon iconName="wand" size={15} />
          비공개 방 생성 / 입장
        </EntryButton>
      </div>

      <button
        type="button"
        onClick={onHelp}
        className="text-text-dim hover:text-app-text mt-[13px] inline-flex cursor-pointer items-center gap-[5px] rounded-lg px-2 py-1 text-[12.5px] font-semibold transition-colors hover:underline hover:underline-offset-[3px]"
      >
        <AppIcon iconName="help" size={14} />
        도움말
      </button>
    </div>
  );
};
