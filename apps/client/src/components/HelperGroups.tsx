import { useState } from "react";
import NumberFlow from "@number-flow/react";
import { Condition, TooltipButton } from "@/common";
import { useAppDispatch, useAppSelector, useGame, useModal, useSceneEffect } from "@/hooks";
import { AppIcon } from "@/icons";
import { setJoystick, setMinimap } from "@/stores/userSlice";
import { openURL } from "@/utils";
import { setIsRinging, setShowIphone } from "@/stores/phoneSlice";

export const HelperGroups = () => {
  const { gameScene } = useGame();
  const { showModal } = useModal();
  const dispatch = useAppDispatch();
  const { showJoystick, loggedIn, showMinimap } = useAppSelector((state) => state.user);
  const [users, setUsers] = useState(0);

  useSceneEffect(gameScene, () => {
    setUsers(gameScene.ohterPlayersMap.size + 1);
  }, []);

  return (
    <div className="fixed bottom-2 right-6 flex gap-2">
      {/* TODO: 삭제 */}
      <TooltipButton
        id="pickup"
        tooltip="전화 걸기 테스트"
        onClick={() => {
          dispatch(setShowIphone(true));
          dispatch(setIsRinging({ state: true, caller: "지헌" }));
        }}
      >
        <AppIcon iconName="pick-up" color="black" size={25} />
      </TooltipButton>

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
          id="joystick"
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

      <TooltipButton
        id="control-guide"
        tooltip="조작 가이드"
        onClick={() => {
          showModal("ControlGuide");
        }}
      >
        <AppIcon iconName="help" color="black" size={25} />
      </TooltipButton>

      <Condition condition={import.meta.env.DEV}>
        <TooltipButton
          id="monitoring"
          tooltip="모니터링"
          onClick={() => {
            openURL(`http://${import.meta.env.VITE_SERVER_URL}/colyseus`);
          }}
        >
          <AppIcon iconName="monitor" color="black" size={25} />
        </TooltipButton>
      </Condition>

      <TooltipButton
        id="github"
        tooltip="깃허브 저장소"
        onClick={() => {
          openURL("https://github.com/Heonys/heoniverse");
        }}
      >
        <AppIcon iconName="github" color="black" size={25} />
      </TooltipButton>
    </div>
  );
};
