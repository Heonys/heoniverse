import { Condition, TooltipButton } from "@/common";
import { useAppDispatch, useAppSelector, useModal } from "@/hooks";
import { AppIcon } from "@/icons";
import { setJoystick } from "@/stores/userSlice";
import { openURL } from "@/utils";

export const HelperGroups = () => {
  const { showModal } = useModal();
  const dispatch = useAppDispatch();
  const { showJoystick, loggedIn } = useAppSelector((state) => state.user);

  return (
    <div className="right-5.5 fixed bottom-2 flex gap-2">
      <Condition condition={loggedIn}>
        <TooltipButton
          id="users"
          tooltip="View Joined Users"
          onClick={() => {
            showModal("JoinedUsers");
          }}
        >
          <AppIcon iconName="people" color="black" size={25} />
        </TooltipButton>
      </Condition>
      <Condition condition={loggedIn}>
        <TooltipButton
          id="joystick"
          tooltip={`${showJoystick ? "Disable" : "Enable"} virtual joystick`}
          onClick={() => dispatch(setJoystick(!showJoystick))}
        >
          <AppIcon iconName="joystick" color="black" size={25} />
        </TooltipButton>
      </Condition>

      <TooltipButton
        id="control-guide"
        tooltip="Control Guide"
        onClick={() => {
          showModal("ControlGuide");
        }}
      >
        <AppIcon iconName="help" color="black" size={25} />
      </TooltipButton>

      <Condition condition={import.meta.env.DEV}>
        <TooltipButton
          id="monitoring"
          tooltip="Monitoring"
          onClick={() => {
            openURL(`http://${import.meta.env.VITE_SERVER_URL}/colyseus`);
          }}
        >
          <AppIcon iconName="monitor" color="black" size={25} />
        </TooltipButton>
      </Condition>

      <TooltipButton
        id="github"
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
