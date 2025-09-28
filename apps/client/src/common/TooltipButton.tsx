import { Button, ButtonProps } from "@headlessui/react";
import { PlacesType, Tooltip } from "react-tooltip";
import { twMerge } from "tailwind-merge";

type Props = {
  id: string;
  tooltip?: string | false;
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
  const showTooltip = !!tooltip;

  return (
    <div className="relative">
      <Button
        {...(showTooltip
          ? {
              "data-tooltip-id": `app-tooltip-${id}`,
              "data-tooltip-content": tooltip,
            }
          : {})}
        className={twMerge(
          "relative flex size-10 cursor-pointer items-center justify-center rounded-full border border-gray-500/20 bg-white shadow-xl outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {children}
      </Button>
      {showTooltip && (
        <Tooltip
          id={`app-tooltip-${id}`}
          place={place}
          className="!select-none !rounded !px-2 !py-1 !text-xs !text-white !shadow-lg"
        />
      )}
    </div>
  );
};
