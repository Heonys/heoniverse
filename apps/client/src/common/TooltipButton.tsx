import { Button, ButtonProps } from "@headlessui/react";
import { PlacesType, Tooltip } from "react-tooltip";
import { twMerge } from "tailwind-merge";

type Props = {
  id: string;
  tooltip: string;
  children: React.ReactNode;
  className?: string;
  place?: PlacesType;
} & ButtonProps;

export const TooltipButton = ({
  id,
  className,
  tooltip,
  place = "top",
  children,
  ...props
}: Props) => {
  return (
    <div className="relative">
      <Button
        data-tooltip-id={`app-tooltip-${id}`}
        data-tooltip-content={tooltip}
        className={twMerge(
          "size-10 relative cursor-pointer flex justify-center items-center bg-white rounded-full shadow-xl border border-gray-500/20",
          className,
        )}
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
