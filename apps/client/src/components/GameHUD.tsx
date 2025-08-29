import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { createPortal } from "react-dom";
import { AnimatePresence } from "motion/react";
import NumberFlow from "@number-flow/react";
import { AppIcon } from "@/icons";
import { AvatarIcon } from "./AvatarIcon";
import { useAppDispatch, useAppSelector, useGame, useSceneEffect } from "@/hooks";
import { cn } from "@/utils";
import { TooltipButton } from "@/common";
import { SelfVideo, RemoteVideo } from "@/components/webcam";
import { setMicEnabled, setViedeoEnabled } from "@/stores/userSlice";
import { eventEmitter } from "@/game/events";

export const GameHUD = () => {
  const { gameScene, network } = useGame();
  const dispatch = useAppDispatch();
  const { name } = useAppSelector((state) => state.room);
  const { mediaConnected, micEnabled, videoEnabled, status, userName, texture } = useAppSelector(
    (state) => state.user,
  );
  const [frame, setFrame] = useState(0);
  const [users, setUsers] = useState(0);
  const videoRef = useRef<Webcam>(null);

  const handleMicEnabled = async (isEnabled: boolean) => {
    if (videoRef.current) {
      const stream = videoRef.current.stream;
      if (stream) {
        const audioTrack = stream.getAudioTracks()[0];
        audioTrack.enabled = isEnabled;
      }
    }
  };

  const handleVideoEnabled = (isEnabled: boolean) => {
    if (videoRef.current) {
      const stream = videoRef.current.stream;
      if (stream) {
        const videoTrack = stream.getVideoTracks()[0];
        videoTrack.enabled = isEnabled;
      }
    }
  };

  const toggleMedia = (isEnabled: boolean) => {
    if (isEnabled) {
      network.webRTC?.disConnectUserMedia();
    } else {
      network.webRTC?.getUserMedia();
    }
  };

  const toggleMic = (isEnabled: boolean) => {
    if (isEnabled) {
      dispatch(setMicEnabled(false));
      handleMicEnabled(false);
      network.updateMediaEnabled({ microphone: false });
    } else {
      dispatch(setMicEnabled(true));
      handleMicEnabled(true);
      network.updateMediaEnabled({ microphone: true });
    }
  };

  const toggleVideo = (isEnabled: boolean) => {
    if (isEnabled) {
      dispatch(setViedeoEnabled(false));
      handleVideoEnabled(false);
      network.updateMediaEnabled({ video: false });
    } else {
      dispatch(setViedeoEnabled(true));
      handleVideoEnabled(true);
      network.updateMediaEnabled({ video: true });
    }
  };

  useEffect(() => {
    const handlerMic = (isEnabled: boolean) => toggleMic(isEnabled);
    const handlerVideo = (isEnabled: boolean) => toggleVideo(isEnabled);

    eventEmitter.on("MIC_ENABLED_CHANGE", handlerMic);
    eventEmitter.on("VIDEO_ENABLED_CHANGE", handlerVideo);
    return () => {
      eventEmitter.off("MIC_ENABLED_CHANGE", handlerMic);
      eventEmitter.off("VIDEO_ENABLED_CHANGE", handlerVideo);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useSceneEffect(gameScene, () => {
    setFrame(gameScene.game.loop.actualFps);
    setUsers(gameScene.ohterPlayersMap.size + 1);
  }, []);

  return (
    <>
      <div
        className={cn(
          "fixed bottom-2 left-1/2 flex w-[440px] -translate-x-1/2 select-none items-center gap-1 rounded-full",
          "border-2 border-white/30 bg-slate-800 px-3 py-2",
        )}
      >
        {/* left */}
        <div className="flex gap-2">
          <AvatarIcon texture={texture} status={status} />
          <div className="flex w-20 flex-col gap-0.5 text-xs text-white">
            <div className="text-sm font-medium">{userName}</div>
            <div
              className="flex cursor-pointer items-center gap-1 text-[#c2c2c2]"
              onClick={() => {
                gameScene.localPlayer.togglePlayerStatus();
              }}
            >
              <div className="capitalize">{status}</div>
              <AppIcon iconName="chevron-right" size={13} />
            </div>
          </div>
        </div>
        {/*  center */}
        <div
          className="flex flex-1 flex-col justify-center gap-0.5 text-xs text-white"
          style={{ fontFamily: "Retro" }}
        >
          <div className="flex items-center justify-center gap-1">
            <AppIcon iconName="room" size={14} />
            <div>{name}</div>
          </div>
          <div className="flex items-center justify-center gap-0.5">
            <div className="flex w-8 items-center gap-1">
              <AppIcon iconName="people" size={14} />
              <NumberFlow value={users} />
            </div>
            <div className="flex items-center gap-0.5">
              <div className="w-5">{frame.toFixed(0)}</div>
              <div className="">fps</div>
            </div>
          </div>
        </div>
        {/* right */}
        <div className="flex items-center justify-end gap-1.5 px-1 text-white">
          <TooltipButton
            id="media-enabled"
            tooltip={`${mediaConnected ? "카메라 및 마이크 접근 거부" : "카메라 및 마이크 접근"}`}
            onClick={() => toggleMedia(mediaConnected)}
            className={cn(
              "size-9 transition-all",
              mediaConnected ? "bg-slate-500/70 text-white" : "bg-white/90 text-black",
            )}
          >
            <AppIcon iconName={mediaConnected ? "link-on" : "link-off"} size={20} />
          </TooltipButton>

          <TooltipButton
            id="camera-enabled"
            disabled={!mediaConnected}
            tooltip={`카메라 ${videoEnabled ? "비활성화" : "활성화"}`}
            onClick={() => toggleVideo(videoEnabled)}
            className={cn(
              "size-9 transition-all",
              videoEnabled ? "bg-slate-500/70 text-white" : "bg-white/90 text-black",
            )}
          >
            <AppIcon iconName={videoEnabled ? "video-on" : "video-off"} size={20} />
          </TooltipButton>

          <TooltipButton
            id="mic-enabled"
            disabled={!mediaConnected}
            tooltip={`마이크 ${micEnabled ? "비활성화" : "활성화"}`}
            onClick={() => toggleMic(micEnabled)}
            className={cn(
              "size-9 transition-all",
              micEnabled ? "bg-slate-500/70 text-white" : "bg-white/90 text-black",
            )}
          >
            <AppIcon iconName={micEnabled ? "mic-on" : "mic-off"} size={20} />
          </TooltipButton>
        </div>
      </div>
      {createPortal(
        <div className="absolute left-1/2 top-3 flex -translate-x-1/2 gap-2">
          <AnimatePresence>
            {mediaConnected && (
              <>
                <SelfVideo ref={videoRef} />
                {Array.from(network.webRTC!.mediaStreamsMap.entries()).map(
                  ([player, mediaStream]) => (
                    <RemoteVideo key={player.playerId} player={player} stream={mediaStream} />
                  ),
                )}
              </>
            )}
          </AnimatePresence>
        </div>,
        document.getElementById("webcam-container")!,
      )}
    </>
  );
};
