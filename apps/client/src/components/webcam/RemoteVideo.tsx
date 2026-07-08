import { memo, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { AppIcon } from "@/icons";
import { AvatarIcon } from "../AvatarIcon";
import { Condition } from "@/common";
import { Player } from "@/game/characters";
import { Status, NUDGE_COOLDOWN_MS } from "@heoniverse/shared";
import { eventEmitter } from "@/game/events";
import { useGame } from "@/hooks";
import { cn } from "@/utils";

type Props = {
  stream: MediaStream;
  player: Player;
};

export const RemoteVideo = memo(({ stream, player }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { micEnabled, videoEnabled, playerName, playerTexture, playerStatus, playerId } = player;
  const [status, setStatus] = useState<Status>(playerStatus);
  const { network } = useGame();
  const [nudged, setNudged] = useState(false);
  const nudgeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // 클릭 즉시 "보냈어요"로 바꾸고 서버 쿨다운만큼 비활성 (낙관적 피드백)
  const handleNudge = () => {
    network.sendNudge(playerId);
    setNudged(true);
    nudgeTimer.current = setTimeout(() => setNudged(false), NUDGE_COOLDOWN_MS);
  };

  useEffect(() => () => clearTimeout(nudgeTimer.current), []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.srcObject = stream;
    const handleLoadedData = () => video.play();
    video.addEventListener("loadeddata", handleLoadedData);
    return () => video.removeEventListener("loadeddata", handleLoadedData);
  }, [stream]);

  useEffect(() => {
    if (videoRef.current) {
      const videoTrack = stream.getVideoTracks()[0];
      const audioTrack = stream.getAudioTracks()[0];

      if (videoTrack) videoTrack.enabled = videoEnabled;
      if (audioTrack) audioTrack.enabled = micEnabled;
    }
  }, [stream, videoEnabled, micEnabled]);

  useEffect(() => {
    const handler = ({ id, status }: { id: string; status: Status }) => {
      if (playerId === id) setStatus(status);
    };
    eventEmitter.on("RENDER_TO_STATUS", handler);
    return () => eventEmitter.off("RENDER_TO_STATUS", handler);
  }, [playerId]);

  // 거리 기반 오디오 볼륨 (리렌더 없이 <video>.volume만 직접 조절)
  useEffect(() => {
    const handler = ({ id, volume }: { id: string; volume: number }) => {
      if (playerId === id && videoRef.current) videoRef.current.volume = volume;
    };
    eventEmitter.on("PROXIMITY_VOLUME_CHANGED", handler);
    return () => eventEmitter.off("PROXIMITY_VOLUME_CHANGED", handler);
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
        {/* 카메라·마이크 둘 다 끄고(=자리 비운 듯) 집중 상태가 아닐 때만 — 목소리로 대화 중인 사람은 제외 */}
        <Condition condition={!micEnabled && status !== "focused"}>
          <button
            onClick={handleNudge}
            disabled={nudged}
            className={cn(
              "absolute bottom-4 left-1/2 flex -translate-x-1/2 cursor-pointer items-center justify-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs outline-none transition active:scale-95 disabled:cursor-default",
              // 보냄: 인디고 틴트 + 체크 + 문구 변경으로 눌렸음을 확실히 표시
              nudged
                ? "border-accent/60 bg-accent/30 text-white"
                : "border-white/50 text-white/90 hover:bg-white/10",
            )}
          >
            <AppIcon iconName={nudged ? "check" : "noti-on"} size={15} />
            {nudged ? "보냈어요" : "알림 보내기"}
          </button>
        </Condition>
      </Condition>

      <video ref={videoRef} className="size-full rounded-2xl" playsInline />
    </motion.div>
  );
});
