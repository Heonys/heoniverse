import { Condition, TooltipButton } from "@/common";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { AppIcon } from "@/icons";
import { setJoystick } from "@/stores/userSlice";
import { openURL } from "@/utils";

export const HelperGroups = () => {
  const dispatch = useAppDispatch();
  const showJoystick = useAppSelector((state) => state.user.showJoystick);

  return (
    <div className="fixed bottom-2 right-5 flex gap-2">
      <TooltipButton
        tooltip={`${showJoystick ? "Disable" : "Enable"} virtual joystick`}
        onClick={() => dispatch(setJoystick(!showJoystick))}
      >
        <AppIcon iconName="joystick" color="black" size={25} />
      </TooltipButton>

      {/* <TooltipButton tooltip="Control Guide">
        <AppIcon iconName="help" color="black" size={25} />
      </TooltipButton> */}

      <TooltipButton tooltip="Room Info">
        <AppIcon iconName="room" color="black" size={25} />
      </TooltipButton>

      <Condition condition={import.meta.env.DEV}>
        <TooltipButton
          tooltip="Colyseus Monitoring"
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
