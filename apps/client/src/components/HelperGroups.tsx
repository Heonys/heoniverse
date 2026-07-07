import { useState } from "react";
import { isBrowser } from "react-device-detect";
import NumberFlow from "@number-flow/react";
import { Condition, TooltipButton } from "@/common";
import { useAppDispatch, useAppSelector, useGame, useModal } from "@/hooks";
import { AppIcon } from "@/icons";
import { setJoystick, setMinimap } from "@/stores/userSlice";
import { openURL, helperButtonClass as helperClass } from "@/utils";

export const HelperGroups = () => {
  const { gameScene, network } = useGame();
  const { showModal } = useModal();
  const dispatch = useAppDispatch();
  const { showJoystick, loggedIn, showMinimap, isAdmin } = useAppSelector((state) => state.user);
  const users = useAppSelector((state) => Object.keys(state.user.otherPlayersName).length + 1);
  const [exitConfirm, setExitConfirm] = useState(false);

  // 방을 떠나 메인 메뉴로. leaveCurrentRoom이 재접속 세션을 지우므로 리로드하면 깔끔히 메뉴로 부팅된다.
  const handleExit = async () => {
    await network.leaveCurrentRoom();
    window.location.reload();
  };

  return (
    <div className="fixed bottom-2 right-6 flex gap-2">
      <Condition condition={loggedIn}>
        <TooltipButton
          id="exit-room"
          tooltip="나가기"
          className={helperClass()}
          onClick={() => setExitConfirm((prev) => !prev)}
        >
          <AppIcon iconName="exit" size={21} />
        </TooltipButton>

        <Condition condition={exitConfirm}>
          <div className="fixed inset-0 z-[59]" onClick={() => setExitConfirm(false)} />
          <div className="from-panel-top to-panel-bot fixed bottom-14 right-6 z-[60] w-60 select-none rounded-[14px] border border-white/10 bg-gradient-to-b p-3.5 text-white shadow-[0_14px_34px_-14px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)]">
            <div className="text-[13px] font-semibold">메인 메뉴로 나갈까요?</div>
            <div className="text-text-dim mb-3 mt-0.5 text-[11.5px]">
              지금 위치는 저장되지 않아요
            </div>
            <div className="flex justify-center gap-1.5">
              <button
                className="flex-1 cursor-pointer rounded-lg bg-white/10 py-1.5 text-sm hover:bg-white/[0.15]"
                onClick={() => setExitConfirm(false)}
              >
                취소
              </button>
              <button
                className="bg-coral flex-1 cursor-pointer rounded-lg py-1.5 text-sm font-medium hover:brightness-[1.07]"
                onClick={handleExit}
              >
                나가기
              </button>
            </div>
          </div>
        </Condition>
      </Condition>

      <Condition condition={loggedIn}>
        <TooltipButton
          id="users"
          tooltip="플레이어 목록"
          className={helperClass()}
          onClick={() => {
            showModal("JoinedUsers");
          }}
        >
          <AppIcon iconName="people" size={21} />
          <div className="bg-accent absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full border-2 border-white p-1 text-[11px] font-bold text-white">
            <NumberFlow value={users} />
          </div>
        </TooltipButton>
      </Condition>

      <Condition condition={loggedIn}>
        <TooltipButton
          id="minimap"
          tooltip={`미니맵 ${showMinimap ? "비활성화" : "활성화"}`}
          className={helperClass(showMinimap)}
          onClick={() => {
            if (showMinimap) gameScene.removeMinimapCamera();
            else gameScene.setupMinimapCamera();

            dispatch(setMinimap(!showMinimap));
          }}
        >
          <AppIcon iconName="map" size={21} />
        </TooltipButton>
      </Condition>

      {/* 조이스틱은 모바일 전용 — 데스크탑은 키보드가 있으니 버튼 자체를 숨긴다 */}
      <Condition condition={loggedIn && !isBrowser}>
        <TooltipButton
          id="joystick"
          tooltip={`조이스틱 ${showJoystick ? "비활성화" : "활성화"}`}
          className={helperClass(showJoystick)}
          onClick={() => dispatch(setJoystick(!showJoystick))}
        >
          <AppIcon iconName="joystick" size={21} />
        </TooltipButton>
      </Condition>

      <Condition condition={loggedIn}>
        <TooltipButton
          id="control-guide"
          tooltip="조작 가이드"
          className={helperClass()}
          onClick={() => showModal("ControlGuide")}
        >
          <AppIcon iconName="help" size={21} />
        </TooltipButton>
      </Condition>

      <Condition condition={import.meta.env.DEV}>
        <TooltipButton
          id="monitoring"
          tooltip="서버 모니터링"
          className={helperClass()}
          onClick={() => openURL("http://localhost:2567/colyseus")}
        >
          <AppIcon iconName="monitor" size={21} />
        </TooltipButton>
      </Condition>

      <Condition condition={isAdmin}>
        <TooltipButton
          id="user-metrics"
          tooltip="사용자 지표"
          className={helperClass()}
          onClick={() => showModal("UserMetrics")}
        >
          <AppIcon iconName="admin" size={21} />
        </TooltipButton>
      </Condition>

      <TooltipButton
        id="github"
        tooltip="Github"
        className={helperClass()}
        onClick={() => openURL("https://github.com/Heonys/heoniverse")}
      >
        <AppIcon iconName="github" size={21} />
      </TooltipButton>
    </div>
  );
};
