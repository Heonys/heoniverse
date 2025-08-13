import { cn } from "@/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
};

export function HeaderButton({ children, onClick, onMouseEnter, className }: Props) {
  return (
    <button
      className={cn(
        "flex h-6 cursor-default items-center gap-2 rounded px-2 hover:bg-gray-100/30",
        className,
      )}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      {children}
    </button>
  );
}
