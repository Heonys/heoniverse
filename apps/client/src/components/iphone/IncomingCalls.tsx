import { motion } from "motion/react";
import { AppIcon } from "@/icons";
import { AvatarIcon } from "@/components";
import { setCurrentPage, setIsConnected, setIsRinging } from "@/stores/phoneSlice";
import { useAppDispatch, useAppSelector, useGame } from "@/hooks";

type Props = { caller: string };

export const IncomingCalls = ({ caller }: Props) => {
  const { network } = useGame();
  const dispatch = useAppDispatch();
  const roomName = useAppSelector((state) => state.room.name);

  return (
    <motion.div
      className="rounded-4xl w-58 absolute left-1/2 top-5 z-50 flex h-14 -translate-x-1/2 items-center gap-2 bg-black px-4 text-white"
      initial={{ y: -15, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -15, opacity: 0 }}
    >
      <AvatarIcon texture="adam" className="size-[30px] bg-white ring-2 ring-white/30" />
      <div className="flex flex-1 flex-col">
        <div className="text-[10px] text-white/50">{roomName}</div>
        <div className="text-[13px]">{caller}</div>
      </div>
      <div
        className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-[#fa4837] p-2"
        onClick={() => {
          dispatch(setIsRinging({ state: false }));
        }}
      >
        <AppIcon iconName="hang-up" />
      </div>
      <div
        className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-[#2ed058] p-2"
        onClick={() => {
          network.webRTC?.getUserMedia().then((allowed) => {
            if (allowed) {
              dispatch(setIsRinging({ state: false }));
              dispatch(setIsConnected({ state: true, startedAt: new Date() }));
              dispatch(setCurrentPage({ page: "dialing", props: { remoteName: caller } }));
            } else {
              dispatch(setIsRinging({ state: false }));
            }
          });
        }}
      >
        <AppIcon iconName="pick-up" />
      </div>
    </motion.div>
  );
};
