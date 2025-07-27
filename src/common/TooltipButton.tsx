import { Button, ButtonProps } from "@headlessui/react";
import { Tooltip } from "react-tooltip";

type Props = {
  tooltip: string;
  children: React.ReactNode;
} & ButtonProps;

export const TooltipButton = ({ tooltip, children, ...props }: Props) => {
  return (
    <div className="relative">
      <Button
        data-tooltip-id="app-tooltip-button"
        data-tooltip-content={tooltip}
        className="size-11 cursor-pointer flex justify-center items-center bg-white rounded-full shadow-xl border border-gray-500/20"
        {...props}
      >
        {children}
      </Button>
      <Tooltip
        id="app-tooltip-button"
        place="top"
        className="!text-white !text-xs !rounded !px-2 !py-1 !shadow-lg !select-none"
      />
    </div>
  );
};
