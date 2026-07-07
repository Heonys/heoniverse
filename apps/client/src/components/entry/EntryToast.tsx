import { ReactNode, useRef } from "react";
import { cn } from "@/utils";

type Props = {
  toast: ReactNode | null;
};

export const EntryToast = ({ toast }: Props) => {
  // 사라지는 동안에도 내용이 남아 있게 마지막 메시지를 기억한다
  const lastNode = useRef<ReactNode>(null);
  if (toast) lastNode.current = toast;

  return (
    <div
      className={cn(
        "pointer-events-none fixed bottom-14 left-1/2 z-[15] -translate-x-1/2 rounded-full border border-white/[0.12] bg-[rgba(20,26,40,0.92)] px-4 py-[9px] text-[12.5px] text-white shadow-[0_12px_28px_-12px_rgba(0,0,0,0.6)] transition-all duration-200",
        toast ? "translate-y-0 opacity-100" : "translate-y-2.5 opacity-0",
      )}
    >
      {lastNode.current}
    </div>
  );
};
