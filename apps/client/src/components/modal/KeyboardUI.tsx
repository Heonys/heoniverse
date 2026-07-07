import { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

export function KeyboardUI() {
  return (
    <div className="flex w-56 select-none flex-col items-center gap-1 rounded bg-[#ececec] p-1.5 text-[10px] font-semibold text-black">
      <div className="flex w-full gap-1 pl-1">
        <Key contents="Esc" />
        <Key contents="W" />
        <Key contents="E" />
        <Key contents="R" />
      </div>

      <div className="flex w-full justify-center gap-1">
        <Key contents="A" />
        <Key contents="S" />
        <Key contents="D" />
        <Key contents="Enter" width={80} />
      </div>

      <div className="flex w-full gap-1 pl-7">
        <Key contents="Space" width={150} />
      </div>
    </div>
  );
}
type Props = {
  contents: string;
  width?: number;
};

function Key({ contents, width = 32 }: Props) {
  return (
    <div
      className={twMerge(
        "flex h-8 items-center justify-center rounded bg-white shadow",
        "border border-black/10 active:bg-[#ececec]",
      )}
      style={{ width }}
    >
      {contents}
    </div>
  );
}

type KbdProps = {
  onClick?: () => void;
} & PropsWithChildren;

export const Kbd = ({ children, onClick }: KbdProps) => {
  return (
    <div
      className="flex h-[26px] min-w-[26px] items-center justify-center rounded-md border border-b-[2.5px] border-white/[0.14] bg-[#101115] px-2 text-xs font-semibold text-[#d6d8de]"
      onClick={onClick}
    >
      {children}
    </div>
  );
};
