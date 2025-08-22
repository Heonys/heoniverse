import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { AppIcon } from "@/icons";
import { AvatarIcon } from "../AvatarIcon";
import { Condition } from "@/common";
import { Player } from "@/game/characters";
import { Status } from "@heoniverse/shared";
import { eventEmitter } from "@/game/events";

type Props = {
  stream: MediaStream;
  player: Player;
};

export const RemoteVideo = ({ stream, player }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { micEnabled, videoEnabled, playerName, playerTexture, playerStatus, playerId } = player;
  const [status, setStatus] = useState<Status>(playerStatus);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.addEventListener("loadeddata", () => {
        videoRef.current?.play();
      });
    }
  }, [stream]);

  useEffect(() => {
    const handler = ({ id, status }: { id: string; status: Status }) => {
      if (playerId === id) setStatus(status);
    };
    eventEmitter.on("RENDER_TO_STATUS", handler);
    return () => eventEmitter.off("RENDER_TO_STATUS", handler);
  }, [playerId]);

  return (
    <motion.div
      className="w-50 relative z-50 h-[150px] select-none rounded-2xl border border-black/50 bg-black shadow-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute left-2 top-2 flex items-center gap-1.5 rounded-lg bg-black/60 p-1 px-2.5 text-xs font-medium text-white backdrop-blur-2xl">
        {!micEnabled ? (
          <AppIcon iconName="mic-off" color="red" size={15} />
        ) : (
          <AppIcon iconName="speak" color="white" size={15} />
        )}
        <div>{playerName.text}</div>
      </div>
      <Condition condition={!videoEnabled}>
        <div className="-translate-1/2 absolute left-1/2 top-1/2 flex flex-col items-center gap-2">
          <AvatarIcon texture={playerTexture} status={status} className="ring-2 ring-white/30" />
        </div>
        <Condition condition={status !== "focused"}>
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center justify-center gap-1.5 rounded-lg border border-white/50 px-2 py-1 text-white/90">
            <AppIcon iconName="noti-on" size={15} />
            <button className="cursor-pointer text-xs outline-none">알림 보내기</button>
          </div>
        </Condition>
      </Condition>

      <video ref={videoRef} className="size-full rounded-2xl" playsInline />
    </motion.div>
  );
};
