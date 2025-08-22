import { motion } from "motion/react";
import { Condition } from "@/common";
import { AppIcon } from "@/icons";
import { AvatarIcon } from "../AvatarIcon";

type Props = {
  micEnabled: boolean;
  videoEnabled: boolean;
};

export const TestVideo = ({ videoEnabled, micEnabled }: Props) => {
  return (
    <motion.div
      className="w-50 relative z-50 h-[150px] select-none rounded-2xl border border-black/50 bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute left-2 top-2 flex items-center gap-1.5 rounded-lg border border-white/40 bg-black/60 p-1 px-2.5 text-xs font-medium text-white backdrop-blur-2xl">
        {!micEnabled ? (
          <AppIcon iconName="mic-off" color="red" size={15} />
        ) : (
          <AppIcon iconName="speak" color="white" size={15} />
        )}
        <div>김지헌</div>
      </div>
      <Condition condition={!videoEnabled}>
        <div className="-translate-1/2 absolute left-1/2 top-1/2 flex flex-col items-center gap-2">
          <AvatarIcon texture="adam" status="available" className="ring-2 ring-white/30" />
        </div>
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center justify-center gap-1.5 rounded-lg border border-white/50 px-2 py-1 text-white/90">
          <AppIcon iconName="noti-on" size={15} />
          <button className="cursor-pointer text-xs outline-none">알림 보내기</button>
        </div>
      </Condition>
    </motion.div>
  );
};
