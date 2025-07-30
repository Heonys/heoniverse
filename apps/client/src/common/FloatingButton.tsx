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
        "z-50 w-13 h-13",
        "relative rounded-full bg-neutral-700 shadow-xl cursor-pointer",
        "flex items-center justify-center",
        "hover:bg-neutral-800 transition-colors duration-300",
        className,
      )}
      {...props}
    >
      {children}
      <div className="absolute top-0 right-0 bg-red-500 size-5 p-1 rounded-full flex justify-center items-center text-white">
        2
      </div>
    </Button>
  );
};
