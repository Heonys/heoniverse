import type { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";
import { AppIcon, type IconNames } from "@/icons/AppIcon";

type Props = {
  iconName: IconNames;
  label?: string;
} & ComponentPropsWithoutRef<"button">;

export const ActionButton = ({ iconName, className, label, ...props }: Props) => {
  return (
    <button
      className={twMerge(
        "relative p-2.5 rounded-lg select-none outline-none",
        "flex cursor-pointer items-center justify-center",
        className,
      )}
      {...props}
    >
      <AppIcon iconName={iconName} size={20} />
      <div className="absolute right-0.5 bottom-0.5 text-xs text-black/40">{label}</div>
    </button>
  );
};
