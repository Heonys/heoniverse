import { cn } from "@/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
};

export function HeaderButton({ children, onClick, onMouseEnter, className }: Props) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 h-6 px-2 cursor-default rounded hover:bg-gray-100/30",
        className,
      )}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      {children}
    </div>
  );
}
