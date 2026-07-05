import { useState } from "react";
import NumberFlow from "@number-flow/react";
import { Condition, TooltipButton } from "@/common";
import { useAppDispatch, useAppSelector, useGame, useModal } from "@/hooks";
import { AppIcon } from "@/icons";
import { setJoystick, setMinimap } from "@/stores/userSlice";
import { openURL } from "@/utils";

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
          onClick={() => setExitConfirm((prev) => !prev)}
        >
          <AppIcon iconName="exit" color="black" size={25} />
        </TooltipButton>

        <Condition condition={exitConfirm}>
          <div className="fixed inset-0 z-[59]" onClick={() => setExitConfirm(false)} />
          <div className="fixed bottom-14 right-6 z-[60] w-60 select-none rounded-xl border-2 border-white/20 bg-slate-800 p-3 text-white shadow-2xl">
            <div className="mb-2.5 text-center text-sm">메인 메뉴로 나갈까요?</div>
            <div className="flex justify-center gap-2">
              <button
                className="flex-1 rounded-lg bg-white/10 py-1.5 text-sm hover:bg-white/20"
                onClick={() => setExitConfirm(false)}
              >
                취소
              </button>
              <button
                className="flex-1 rounded-lg bg-[#e0575b] py-1.5 text-sm font-medium hover:bg-[#d8474b]"
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
          onClick={() => {
            showModal("JoinedUsers");
          }}
        >
          <AppIcon iconName="people" color="black" size={25} />
          <div className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-slate-600 p-1 text-xs text-white">
            <NumberFlow value={users} />
          </div>
        </TooltipButton>
      </Condition>

      <Condition condition={loggedIn}>
        <TooltipButton
          id="minimap"
          tooltip={`미니맵 ${showMinimap ? "비활성화" : "활성화"}`}
          onClick={() => {
            if (showMinimap) gameScene.removeMinimapCamera();
            else gameScene.setupMinimapCamera();

            dispatch(setMinimap(!showMinimap));
          }}
        >
          <AppIcon iconName="map" color="black" size={25} />
        </TooltipButton>
      </Condition>

      <Condition condition={loggedIn}>
        <TooltipButton
          id="joystick"
          tooltip={`조이스틱 ${showJoystick ? "비활성화" : "활성화"}`}
          onClick={() => dispatch(setJoystick(!showJoystick))}
        >
          <AppIcon iconName="joystick" color="black" size={25} />
        </TooltipButton>
      </Condition>

      <Condition condition={loggedIn}>
        <TooltipButton
          id="control-guide"
          tooltip="조작 가이드"
          onClick={() => showModal("ControlGuide")}
        >
          <AppIcon iconName="help" color="black" size={25} />
        </TooltipButton>
      </Condition>

      <Condition condition={import.meta.env.DEV}>
        <TooltipButton
          id="monitoring"
          tooltip="서버 모니터링"
          onClick={() => openURL("http://localhost:2567/colyseus")}
        >
          <AppIcon iconName="monitor" color="black" size={25} />
        </TooltipButton>
      </Condition>

      <Condition condition={isAdmin}>
        <TooltipButton
          id="user-metrics"
          tooltip="사용자 지표"
          onClick={() => showModal("UserMetrics")}
        >
          <AppIcon iconName="admin" color="black" size={25} />
        </TooltipButton>
      </Condition>

      <TooltipButton
        id="github"
        tooltip="Github"
        onClick={() => openURL("https://github.com/Heonys/heoniverse")}
      >
        <AppIcon iconName="github" color="black" size={25} />
      </TooltipButton>
    </div>
  );
};
