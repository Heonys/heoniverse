import { motion } from "motion/react";
import { TooltipButton } from "@/common";
import { AppIcon } from "@/icons";

type Props = { message: string };

export const ProgressBar = ({ message }: Props) => {
  return (
    <div className="flex w-full flex-col items-center gap-1">
      <div className="flex items-center gap-1">
        <div className="text-center text-sm font-medium text-[#e0e0e0]">{message}</div>
        <TooltipButton
          id="progress-warning"
          tooltip="연결되지 않을 경우 새로고침을 시도해주세요"
          className="size-5 border-none bg-transparent"
        >
          <AppIcon iconName="warning-tri" className="text-[#ffb056]" />
        </TooltipButton>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-md bg-white/20">
        <motion.div
          className="h-full rounded-md bg-gradient-to-r from-teal-500 via-teal-400 to-teal-300"
          initial={{ x: "-100%" }}
          animate={{ x: ["-100%", "100%"] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
    </div>
  );
};
