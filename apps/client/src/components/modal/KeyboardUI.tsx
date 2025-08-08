import { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

export function KeyboardUI() {
  return (
    <div className="flex flex-col gap-1 items-center bg-[#ececec] w-56  p-1.5 text-black rounded font-semibold text-[10px] select-none">
      <div className="flex gap-1 w-full pl-1">
        <Key contents="Esc" />
        <Key contents="W" />
        <Key contents="E" />
        <Key contents="R" />
      </div>

      <div className="flex gap-1 w-full justify-center">
        <Key contents="A" />
        <Key contents="S" />
        <Key contents="D" />
        <Key contents="Enter" width={80} />
      </div>

      {/* <div className="flex gap-1 w-full pl-7">
        <Key contents="Z" />
        <Key contents="Space" width={136} />
      </div> */}
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
        "h-8 bg-white rounded flex items-center justify-center shadow",
        "active:bg-[#ececec] border border-black/10",
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
      className="rounded-[4px] flex justify-center items-center border-[0.8px] border-b-2 border-b-[color(srgb_0.093811_0.0938339_0.105878/_0.2)] bg-[oklch(98%_0_0)] px-2 py-0.5 text-xs font-semibold text-[oklch(0.21_0.006_285.885)]"
      onClick={onClick}
    >
      {children}
    </div>
  );
};
