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
        data-tooltip-id={`app-actoin-button-tooltip-${name}`}
        data-tooltip-content={name}
        data-tooltip-delay-show={500}
        className={cn(
          "relative p-3 rounded-lg select-none outline-none",
          "flex cursor-pointer items-center justify-center transition-all",
          name === selected ? "bg-blue-200" : "hover:bg-blue-100",
        )}
        onClick={() => onClick(name)}
      >
        <AppIcon iconName={iconName} size={20} />
        <Condition condition={label}>
          <div className="absolute right-0.5 bottom-0.5 text-xs text-black/40">{label}</div>
        </Condition>
      </button>
      <Tooltip
        id={`app-actoin-button-tooltip-${name}`}
        place="bottom"
        className="!text-white !text-xs !rounded !px-2 !py-1 !select-none capitalize"
      />
    </>
  );
};
