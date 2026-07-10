import { format } from "date-fns";
import { useCurrentTime } from "@/hooks";
import { AppIcon } from "@/icons";
import { cn } from "@/utils";

type Tone = "light" | "dark";

// AppIcon은 currentColor를 상속하므로 tone으로 텍스트 색만 바꾸면 아이콘도 함께 바뀐다
export const StatusBar = ({ tone = "light" }: { tone?: Tone }) => {
  const time = useCurrentTime();
  return (
    <div
      className={cn(
        "rounded-t-4xl relative flex-none text-[13px] font-bold",
        tone === "light" ? "text-black" : "text-white",
      )}
    >
      <div className="absolute left-1/2 top-2 h-[22px] w-20 -translate-x-1/2 rounded-full bg-[#040404]" />
      <div className="relative flex h-9 w-full items-center px-5 py-2">
        <div className="ml-2">{format(time, "h:mm")}</div>
        <div className="flex flex-1 items-center justify-end gap-1.5">
          <AppIcon iconName="signal" size={14} />
          <AppIcon iconName="wifi" size={14} />
          <AppIcon iconName="batterty-half" size={16} />
        </div>
      </div>
    </div>
  );
};

// relative인 타이틀 행 안에서 절대배치로 쓴다
export const BackChevron = ({
  onClick,
  color = "#0579fb",
}: {
  onClick: () => void;
  color?: string;
}) => (
  <button
    className="absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer outline-none"
    onClick={onClick}
    aria-label="뒤로"
  >
    <AppIcon iconName="chevron-left" color={color} size={23} />
  </button>
);
