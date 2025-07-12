import { AppIcon } from "@/common";
import { TooltipButton } from "@/common/TooltipButton";

export const HelperGroups = () => {
  return (
    <div className="fixed bottom-2 right-5 flex gap-2">
      <TooltipButton text="Enable virtual joystick">
        <AppIcon iconName="joystick" color="black" size={27} />
      </TooltipButton>

      <TooltipButton text="Control Guide">
        <AppIcon iconName="help" color="black" size={27} />
      </TooltipButton>

      <TooltipButton text="Room Info">
        <AppIcon iconName="room" color="black" size={27} />
      </TooltipButton>

      <TooltipButton text="Visit GitHub">
        <AppIcon iconName="github" color="black" size={27} />
      </TooltipButton>
    </div>
  );
};
