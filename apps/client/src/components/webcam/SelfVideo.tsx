import { forwardRef, useState } from "react";
import { motion } from "motion/react";
import Webcam from "react-webcam";
import { useAppSelector, useGame } from "@/hooks";
import { AppIcon } from "@/icons";
import { Condition } from "@/common";
import { AvatarIcon } from "@/components";
import { cn } from "@/utils";

export const SelfVideo = forwardRef<Webcam, any>((_, ref) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { network, getLocalPlayer } = useGame();
  const { videoEnabled, micEnabled } = useAppSelector((state) => state.user);
  const player = getLocalPlayer();

  const onUserMedia = (stream: MediaStream) => {
    const audioCtx = new AudioContext();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 1024;

    source.connect(analyser);
    const dataArray = new Uint8Array(analyser.fftSize);
    const checkVoice = () => {
      analyser.getByteTimeDomainData(dataArray);
      const avg = dataArray.reduce((sum, val) => sum + Math.abs(val - 128), 0) / dataArray.length;
      setIsSpeaking(avg > 3);
      requestAnimationFrame(checkVoice);
    };
    checkVoice();
  };

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
          <AppIcon
            className={cn(`${isSpeaking && "animate-ping"}`)}
            iconName="speak"
            color="white"
            size={15}
          />
        )}
        <div>{player.playerName.text}</div>
      </div>
      <Condition condition={!videoEnabled}>
        <div className="-translate-1/2 absolute left-1/2 top-1/2 flex flex-col items-center gap-2">
          <AvatarIcon
            texture={player.playerTexture}
            status={player.playerStatus}
            className="ring-2 ring-white/30"
          />
        </div>
      </Condition>

      <Webcam
        className="size-full rounded-2xl"
        audio={true}
        ref={ref}
        playsInline
        muted
        onUserMedia={(stream) => {
          network.webRTC?.setupMediaStream(stream);
          onUserMedia(stream);
          player.readyToStream = true;
        }}
      />
    </motion.div>
  );
});
