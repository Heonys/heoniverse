import { Condition, TooltipButton } from "@/common";
import { phaserGame } from "@/game";
import { Preloader } from "@/game/scenes";
import { useAppDispatch, useAppSelector, useModal } from "@/hooks";
import { AppIcon } from "@/icons";
import { setJoystick } from "@/stores/userSlice";
import { openURL } from "@/utils";

export const HelperGroups = () => {
  const { showModal, hideModal } = useModal();
  const dispatch = useAppDispatch();
  const showJoystick = useAppSelector((state) => state.user.showJoystick);
  const preloader = phaserGame.scene.keys.preloader as Preloader;

  return (
    <div className="fixed bottom-2 right-5 flex gap-2">
      <TooltipButton
        tooltip="Leave Room"
        onClick={() => {
          showModal("LeaveRoom", {
            onClose: () => {
              preloader.network.leaveCurrentRoom().then(() => {
                preloader.leaveGame();
                hideModal();
              });
            },
          });
        }}
      >
        <AppIcon iconName="door" color="black" size={25} />
      </TooltipButton>

      <TooltipButton
        tooltip="Control Guide"
        onClick={() => {
          showModal("ControlGuide");
        }}
      >
        <AppIcon iconName="help" color="black" size={25} />
      </TooltipButton>

      <TooltipButton
        tooltip={`${showJoystick ? "Disable" : "Enable"} virtual joystick`}
        onClick={() => dispatch(setJoystick(!showJoystick))}
      >
        <AppIcon iconName="joystick" color="black" size={25} />
      </TooltipButton>

      <Condition condition={import.meta.env.DEV}>
        <TooltipButton
          tooltip="Monitoring"
          onClick={() => {
            openURL(`http://${import.meta.env.VITE_SERVER_URL}/colyseus`);
          }}
        >
          <AppIcon iconName="monitor" color="black" size={25} />
        </TooltipButton>
      </Condition>

      <TooltipButton
        tooltip="Visit GitHub"
        onClick={() => {
          openURL("https://github.com/Heonys/heoniverse");
        }}
      >
        <AppIcon iconName="github" color="black" size={25} />
      </TooltipButton>
    </div>
  );
};
