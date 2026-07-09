import { useEffect, useState } from "react";
import { PropsWithChildren } from "react";
import NumberFlow from "@number-flow/react";
import { AnimatePresence, motion } from "motion/react";
import { Condition } from "@/common";
import { useAppDispatch, useAppSelector, useGame, useModal } from "@/hooks";
import { AppIcon, IconNames } from "@/icons";
import { setJoystick, setMinimap } from "@/stores/userSlice";
import { cn, openURL } from "@/utils";

type Props = { open: boolean; onClose: () => void };

// 모바일 전용 ⋯ 액션 시트 — 데스크탑 HelperGroups의 항목들을 하단 시트에 담는다.
// 자주 쓰는 것(채팅·미디어)은 HUD 슬림바에 남고, 가끔 쓰는 것들이 여기로 온다.
export const MobileActionSheet = ({ open, onClose }: Props) => {
  const { gameScene, network } = useGame();
  const { showModal } = useModal();
  const dispatch = useAppDispatch();
  const { showMinimap, showJoystick, isAdmin } = useAppSelector((state) => state.user);
  const roomName = useAppSelector((state) => state.room.name);
  const users = useAppSelector((state) => Object.keys(state.user.otherPlayersName).length + 1);
  const [exitConfirm, setExitConfirm] = useState(false);

  // 시트를 닫으면 나가기 확인 상태도 초기화
  useEffect(() => {
    if (!open) setExitConfirm(false);
  }, [open]);

  const handleExit = async () => {
    await network.leaveCurrentRoom();
    window.location.reload();
  };

  const runAndClose = (fn: () => void) => () => {
    fn();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[70] bg-black/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-x-2 bottom-[max(8px,env(safe-area-inset-bottom))] z-[71] rounded-[20px] border border-white/10 bg-[#191b22] p-2"
            initial={{ y: "115%" }}
            animate={{ y: 0 }}
            exit={{ y: "115%" }}
            transition={{ type: "spring", stiffness: 340, damping: 32 }}
          >
            <div className="mx-auto mb-1.5 h-1 w-9 rounded-full bg-white/20" />

            {/* 방 정보 — 상단 칩에서 분리해 여기로 */}
            <div className="text-text-dim flex items-center gap-1.5 px-3.5 pb-2 pt-1 text-[12px]">
              <AppIcon iconName="room" size={14} className="text-accent-hi" />
              <span className="text-app-text font-semibold">{roomName}</span>
              <span>
                · <NumberFlow value={users} />명 접속 중
              </span>
            </div>
            <div className="mx-3 mb-1 h-px bg-white/[0.07]" />

            <SheetItem
              icon="people"
              onClick={runAndClose(() => showModal("JoinedUsers"))}
              trailing={
                <span className="text-text-dim text-xs">
                  <NumberFlow value={users} />명
                </span>
              }
            >
              플레이어 목록
            </SheetItem>
            <SheetItem
              icon="map"
              active={showMinimap}
              onClick={runAndClose(() => {
                if (showMinimap) gameScene.removeMinimapCamera();
                else gameScene.setupMinimapCamera();
                dispatch(setMinimap(!showMinimap));
              })}
            >
              {`미니맵 ${showMinimap ? "끄기" : "켜기"}`}
            </SheetItem>
            <SheetItem
              icon="joystick"
              active={showJoystick}
              onClick={runAndClose(() => dispatch(setJoystick(!showJoystick)))}
            >
              {`조이스틱 ${showJoystick ? "숨기기" : "표시"}`}
            </SheetItem>
            <SheetItem icon="help" onClick={runAndClose(() => showModal("ControlGuide"))}>
              조작 가이드
            </SheetItem>
            <Condition condition={import.meta.env.DEV}>
              <SheetItem
                icon="monitor"
                onClick={runAndClose(() => openURL("http://localhost:2567/colyseus"))}
              >
                서버 모니터링
              </SheetItem>
            </Condition>
            <Condition condition={isAdmin}>
              <SheetItem icon="admin" onClick={runAndClose(() => showModal("UserMetrics"))}>
                사용자 지표
              </SheetItem>
            </Condition>
            <SheetItem
              icon="github"
              onClick={runAndClose(() => openURL("https://github.com/Heonys/heoniverse"))}
            >
              Github
            </SheetItem>

            <div className="mx-3 my-1 h-px bg-white/[0.07]" />

            <SheetItem
              icon="exit"
              danger
              onClick={() => {
                if (exitConfirm) handleExit();
                else setExitConfirm(true);
              }}
              trailing={
                exitConfirm ? (
                  <span className="text-coral text-[11px]">한 번 더 누르면 나가요</span>
                ) : undefined
              }
            >
              {exitConfirm ? "정말 나갈까요?" : "방 나가기"}
            </SheetItem>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

type ItemProps = PropsWithChildren<{
  icon: IconNames;
  onClick: () => void;
  active?: boolean;
  danger?: boolean;
  trailing?: React.ReactNode;
}>;

const SheetItem = ({ icon, onClick, active, danger, trailing, children }: ItemProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full cursor-pointer items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm",
        "active:bg-white/[0.08]",
        danger ? "text-coral" : "text-[#e3e6ee]",
      )}
    >
      <AppIcon iconName={icon} size={19} className={cn(active && "text-accent-hi")} />
      <span className="flex-1 font-medium">{children}</span>
      {trailing}
    </button>
  );
};
