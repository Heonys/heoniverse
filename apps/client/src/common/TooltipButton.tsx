import { Button, ButtonProps } from "@headlessui/react";
import { PlacesType, Tooltip } from "react-tooltip";

type Props = {
  id: string;
  tooltip: string;
  children: React.ReactNode;
  place?: PlacesType;
} & ButtonProps;

export const TooltipButton = ({ id, tooltip, place = "top", children, ...props }: Props) => {
  return (
    <div className="relative">
      <Button
        data-tooltip-id={`app-tooltip-${id}`}
        data-tooltip-content={tooltip}
        className="size-10 cursor-pointer flex justify-center items-center bg-white rounded-full shadow-xl border border-gray-500/20"
        {...props}
      >
        {children}
      </Button>
      <Tooltip
        id={`app-tooltip-${id}`}
        place={place}
        className="!text-white !text-xs !rounded !px-2 !py-1 !shadow-lg !select-none"
      />
    </div>
  );
};
