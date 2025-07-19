import { AppIcon, Condition, TooltipButton } from "@/common";
import { openURL } from "@/utils";

export const HelperGroups = () => {
  return (
    <div className="fixed bottom-2 right-5 flex gap-2">
      <Condition condition={import.meta.env.DEV}>
        <TooltipButton
          tooltip="Colyseus Monitoring"
          onClick={() => {
            openURL(`http://${import.meta.env.VITE_SERVER_URL}/colyseus`);
          }}
        >
          <AppIcon iconName="monitor" color="black" size={27} />
        </TooltipButton>
      </Condition>

      <TooltipButton tooltip="Enable virtual joystick">
        <AppIcon iconName="joystick" color="black" size={27} />
      </TooltipButton>

      <TooltipButton tooltip="Control Guide">
        <AppIcon iconName="help" color="black" size={27} />
      </TooltipButton>

      <TooltipButton tooltip="Room Info">
        <AppIcon iconName="room" color="black" size={27} />
      </TooltipButton>

      <TooltipButton tooltip="Visit GitHub">
        <AppIcon iconName="github" color="black" size={27} />
      </TooltipButton>
    </div>
  );
};
