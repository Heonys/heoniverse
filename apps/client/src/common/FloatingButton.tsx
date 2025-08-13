import { Button, ButtonProps } from "@headlessui/react";
import { cn } from "@/utils";

type Props = {
  className?: string;
} & React.PropsWithChildren &
  ButtonProps<"button">;

export const FloatingButton = ({ children, className, ...props }: Props) => {
  return (
    <Button
      className={cn(
        "w-13 h-13 z-50",
        "relative cursor-pointer rounded-full bg-neutral-700 shadow-xl",
        "flex items-center justify-center",
        "transition-colors duration-300 hover:bg-neutral-800",
        className,
      )}
      {...props}
    >
      {children}
      <div className="absolute right-0 top-0 flex size-5 items-center justify-center rounded-full bg-red-500 p-1 text-white">
        2
      </div>
    </Button>
  );
};
