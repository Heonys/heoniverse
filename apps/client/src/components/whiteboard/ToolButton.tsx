import { Tooltip } from "react-tooltip";
import { Condition } from "@/common";
import { AppIcon, type IconNames } from "@/icons/AppIcon";
import { cn } from "@/utils";
import { Tools } from "@/constants/drawing";

type Props = {
  name: Tools;
  iconName: IconNames;
  selected: string;
  onClick: (name: Tools) => void;
  label?: string;
};

export const ToolButton = ({ name, iconName, selected, onClick, label }: Props) => {
  return (
    <>
      <button
        data-tooltip-id={`app-action-button-tooltip-${name}`}
        data-tooltip-content={name}
        data-tooltip-delay-show={500}
        className={cn(
          "relative select-none rounded-lg p-3 outline-none",
          "flex cursor-pointer items-center justify-center transition-all",
          name === selected ? "bg-blue-200" : "hover:bg-blue-100",
        )}
        onClick={() => onClick(name)}
      >
        <AppIcon iconName={iconName} size={20} />
        <Condition condition={label}>
          <div className="absolute bottom-0.5 right-0.5 text-xs text-black/40">{label}</div>
        </Condition>
      </button>
      <Tooltip
        id={`app-action-button-tooltip-${name}`}
        place="bottom"
        className="!select-none !rounded !px-2 !py-1 !text-xs capitalize !text-white"
      />
    </>
  );
};
