import { forwardRef, useState } from "react";
import Webcam from "react-webcam";
import { useAppSelector } from "@/hooks";
import { AppIcon } from "@/icons";
import { Condition } from "@/common";
import { AvatarIcon } from "../AvatarIcon";
import { cn } from "@/utils";

export const SelfVideo = forwardRef<Webcam, any>((_, ref) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { videoEnabled, micEnabled } = useAppSelector((state) => state.user);

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
    <div className="w-50 relative z-50 h-[150px] select-none rounded-2xl border border-black/50 bg-slate-800 shadow-lg">
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
        <div>지헌</div>
      </div>
      <Condition condition={!videoEnabled}>
        <div className="-translate-1/2 absolute left-1/2 top-1/2 flex flex-col items-center gap-2">
          <AvatarIcon texture="adam" status="online" className="ring-2 ring-white/30" />
        </div>
        {/* <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center justify-center gap-1.5 rounded-lg border border-white/50 px-2 py-1 text-white/90">
          <AppIcon iconName="noti-on" size={15} />
          <button className="cursor-pointer text-xs outline-none">알림 보내기</button>
        </div> */}
      </Condition>

      <Webcam
        className="size-full rounded-2xl"
        audio={true}
        ref={ref}
        playsInline
        muted
        onUserMedia={onUserMedia}
      />
    </div>
  );
});
