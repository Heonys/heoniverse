import { PropsWithChildren, Ref } from "react";
import { cn } from "@/utils";

type PanelProps = PropsWithChildren<{ className?: string; ref?: Ref<HTMLDivElement> }>;

// 두 카드가 공유하는 다크 패널 셸 (그라데이션 + 상단 하이라이트)
export const Panel = ({ className, children, ref }: PanelProps) => {
  return (
    <div
      ref={ref}
      className={cn(
        "animate-rise from-panel-top to-panel-bot relative rounded-[20px] border border-white/10 bg-gradient-to-b",
        "shadow-[0_30px_70px_-20px_rgba(10,20,40,0.75),0_4px_16px_-6px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)]",
        "before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-[radial-gradient(80%_40%_at_50%_0%,rgba(255,255,255,0.06),transparent_70%)] before:content-['']",
        className,
      )}
    >
      {children}
    </div>
  );
};

type EntryButtonProps = PropsWithChildren<{
  variant?: "primary" | "secondary";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
}>;

export const EntryButton = ({
  variant = "primary",
  className,
  disabled,
  type = "button",
  onClick,
  children,
}: EntryButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-transparent text-[14.5px] font-medium text-white transition",
        "active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" &&
          "bg-accent shadow-[0_6px_14px_-11px_rgba(86,101,214,0.36),inset_0_1px_0_rgba(255,255,255,0.1)] hover:brightness-[1.06]",
        variant === "secondary" &&
          "bg-surface-2 text-app-text border-white/[0.07] hover:border-white/[0.14] hover:bg-[#24252b]",
        className,
      )}
    >
      {children}
    </button>
  );
};

// 카드1 하위 뷰 공통 헤더: [← 뒤로] + 제목 (+ 한 줄 설명)
export const ViewHead = ({
  title,
  sub,
  onBack,
}: {
  title: string;
  sub?: string;
  onBack: () => void;
}) => {
  return (
    <>
      <div className="flex items-center gap-[9px]">
        <button
          type="button"
          onClick={onBack}
          className="bg-surface-2 text-text-dim hover:text-app-text grid size-[30px] flex-none cursor-pointer place-items-center rounded-[9px] border border-white/[0.07] transition-colors hover:bg-[#24252b]"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <span className="text-[17px] font-semibold tracking-[-0.01em] text-white">{title}</span>
      </div>
      {sub && <div className="text-text-dim mb-3.5 mt-[5px] text-[12.5px]">{sub}</div>}
    </>
  );
};
