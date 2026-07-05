import { useEffect, useReducer, useRef, useState } from "react";
import Webcam from "react-webcam";
import { isBrowser } from "react-device-detect";
import { createPortal } from "react-dom";
import { AnimatePresence } from "motion/react";
import NumberFlow from "@number-flow/react";
import { AppIcon } from "@/icons";
import { AvatarIcon } from "./AvatarIcon";
import { useAppDispatch, useAppSelector, useGame } from "@/hooks";
import { cn } from "@/utils";
import { TooltipButton, Condition } from "@/common";
import { SelfVideo, RemoteVideo } from "@/components/webcam";
import { setMicEnabled, setVideoEnabled } from "@/stores/userSlice";
import { eventEmitter } from "@/game/events";
import { EMOTES } from "@heoniverse/shared";

export const GameHUD = () => {
  const { gameScene, network } = useGame();
  const dispatch = useAppDispatch();
  const { name } = useAppSelector((state) => state.room);
  const { mediaConnected, micEnabled, videoEnabled, status, userName, texture } = useAppSelector(
    (state) => state.user,
  );
  const users = useAppSelector((state) => Object.keys(state.user.otherPlayersName).length + 1);
  const [frame, setFrame] = useState(0);
  const [emoteWheelOpen, setEmoteWheelOpen] = useState(false);
  const videoRef = useRef<Webcam>(null);

  const sendEmote = (emote: string) => {
    gameScene.localPlayer.showEmote(emote);
    network.sendMessage("SEND_EMOTE", emote);
    setEmoteWheelOpen(false);
  };
  // mediaStreamsMap은 mutable Map이라 변경 이벤트를 받아 리렌더를 트리거한다
  const [, forceStreamsUpdate] = useReducer((x: number) => x + 1, 0);

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
      dispatch(setVideoEnabled(false));
      handleVideoEnabled(false);
      network.updateMediaEnabled({ video: false });
    } else {
      dispatch(setVideoEnabled(true));
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

  useEffect(() => {
    const intervalId = setInterval(() => {
      setFrame(Math.round(gameScene.game.loop.actualFps));
    }, 1000);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handler = () => forceStreamsUpdate();
    eventEmitter.on("MEDIA_STREAMS_CHANGED", handler);
    return () => eventEmitter.off("MEDIA_STREAMS_CHANGED", handler);
  }, []);

  // G 키(게임 씬) 또는 HUD 버튼으로 이모트 휠 토글
  useEffect(() => {
    const handler = () => setEmoteWheelOpen((prev) => !prev);
    eventEmitter.on("TOGGLE_EMOTE_WHEEL", handler);
    return () => eventEmitter.off("TOGGLE_EMOTE_WHEEL", handler);
  }, []);

  useEffect(() => {
    if (!emoteWheelOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setEmoteWheelOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [emoteWheelOpen]);

  return (
    <>
      <div
        className={cn(
          "fixed bottom-2 left-1/2 flex -translate-x-1/2 select-none items-center rounded-full",
          "border-2 border-white/30 bg-slate-800 px-3 py-2",
          isBrowser ? "w-[440px] gap-1" : "w-[375px]",
        )}
      >
        {/* left */}
        <div className="flex gap-2">
          <AvatarIcon texture={texture} status={status} />
          <div className="flex min-w-[66px] flex-col gap-0.5 text-xs text-white">
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
            <AppIcon iconName="room" size={16} />
            <div>{name}</div>
          </div>
          <div className="flex items-center justify-center gap-0.5">
            <div className="flex w-8 items-center gap-1">
              <AppIcon iconName="people" size={14} />
              <NumberFlow value={users} />
            </div>
            <div className="flex items-center gap-1">
              <div className="w-6">{frame.toFixed(0)}</div>
              <div className="">fps</div>
            </div>
          </div>
        </div>
        {/* right */}
        <div className="flex items-center justify-end gap-1.5 px-1 text-white">
          {/* 데스크탑은 G 키로 여니까 버튼은 키보드 없는 모바일에서만 노출 */}
          <Condition condition={!isBrowser}>
            <TooltipButton
              id="emote"
              onClick={() => setEmoteWheelOpen((prev) => !prev)}
              className={cn(
                "transition-all",
                "size-7.5",
                emoteWheelOpen ? "bg-slate-500/70" : "bg-white/90",
              )}
            >
              <div className="text-lg leading-none">😀</div>
            </TooltipButton>
          </Condition>

          <TooltipButton
            id="media-enabled"
            tooltip={
              isBrowser && (mediaConnected ? "카메라 및 마이크 접근 거부" : "카메라 및 마이크 접근")
            }
            onClick={() => toggleMedia(mediaConnected)}
            className={cn(
              "transition-all",
              isBrowser ? "size-8.5" : "size-7.5",
              mediaConnected ? "bg-slate-500/70 text-white" : "bg-white/90 text-black",
            )}
          >
            <AppIcon
              iconName={mediaConnected ? "link-on" : "link-off"}
              size={isBrowser ? 18 : 16}
            />
          </TooltipButton>

          <TooltipButton
            id="camera-enabled"
            disabled={!mediaConnected}
            tooltip={isBrowser && `카메라 ${videoEnabled ? "비활성화" : "활성화"}`}
            onClick={() => toggleVideo(videoEnabled)}
            className={cn(
              "transition-all",
              isBrowser ? "size-8.5" : "size-7.5",
              videoEnabled ? "bg-slate-500/70 text-white" : "bg-white/90 text-black",
            )}
          >
            <AppIcon
              iconName={videoEnabled ? "video-on" : "video-off"}
              size={isBrowser ? 18 : 16}
            />
          </TooltipButton>

          <TooltipButton
            id="mic-enabled"
            disabled={!mediaConnected}
            tooltip={isBrowser && `마이크 ${micEnabled ? "비활성화" : "활성화"}`}
            onClick={() => toggleMic(micEnabled)}
            className={cn(
              "transition-all",
              isBrowser ? "size-8.5" : "size-7.5",
              micEnabled ? "bg-slate-500/70 text-white" : "bg-white/90 text-black",
            )}
          >
            <AppIcon iconName={micEnabled ? "mic-on" : "mic-off"} size={isBrowser ? 18 : 16} />
          </TooltipButton>
        </div>
      </div>

      {/* 이모트 라디얼 휠 — 캐릭터(화면 중앙) 주변에 원형으로 표시 */}
      <Condition condition={emoteWheelOpen}>
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20"
          onClick={() => setEmoteWheelOpen(false)}
        >
          <div className="relative size-52" onClick={(e) => e.stopPropagation()}>
            {EMOTES.map((emote, i) => {
              const angle = (-90 + i * (360 / EMOTES.length)) * (Math.PI / 180);
              const radius = 92;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              return (
                <div
                  key={emote}
                  className="absolute"
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <button
                    className="flex size-12 items-center justify-center rounded-full border border-white/20 bg-slate-800 text-2xl shadow-lg transition-transform hover:scale-110"
                    onClick={() => sendEmote(emote)}
                  >
                    {emote}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </Condition>

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
