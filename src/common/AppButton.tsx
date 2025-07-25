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
        "rounded cursor-pointer bg-sky-600 p-2 text-sm text-white",
        "disabled:opacity-70 disabled:cursor-not-allowed",
        className,
      )}
      disabled={disabled}
      type="submit"
      {...props}
    ></Button>
  );
};
