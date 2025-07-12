import { Button, ButtonProps } from "@headlessui/react";
import { cn } from "@/utils";

type Props = {
  className?: string;
} & React.PropsWithChildren &
  ButtonProps<"button">;

export const IconButton = ({ className, children, ...props }: Props) => {
  return (
    <Button className={cn("cursor-pointer", className)} {...props}>
      {children}
    </Button>
  );
};
