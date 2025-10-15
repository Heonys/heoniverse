import { Button, ButtonProps } from "@headlessui/react";
import { cn } from "@/utils";

type Props = {
  className?: string;
  disabled?: boolean;
} & ButtonProps<"button">;

export const AppButton = ({ className, disabled, ...props }: Props) => {
  return (
    <Button
      className={cn(
        "cursor-pointer rounded bg-[#5865f2] p-2 text-sm text-white",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      disabled={disabled}
      {...props}
    ></Button>
  );
};
