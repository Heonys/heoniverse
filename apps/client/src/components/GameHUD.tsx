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

// 미디어 토글 공통 룩 — 켜짐 = 인디고, 꺼짐 = 다크 고스트
const toggleClass = (active: boolean) =>
  cn(
    "rounded-[11px] border shadow-none transition-all",
    isBrowser ? "size-8.5" : "size-7.5",
    active
      ? "border-transparent bg-accent text-white shadow-[0_4px_12px_-6px_rgba(86,101,214,0.36),inset_0_1px_0_rgba(255,255,255,0.14)]"
      : "bg-surface-2 text-text-faint hover:text-app-text border-white/[0.07] hover:bg-[#24252b]",
  );

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
  // 연결 안내 말풍선 — 연결 버튼 위에 붙어서, 켜거나 닫으면 사라진다 (구 GameNoti 토스트 대체)
  const [showLinkHint, setShowLinkHint] = useState(true);
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
          "from-panel-top to-panel-bot fixed bottom-2 left-1/2 flex -translate-x-1/2 select-none items-center rounded-2xl",
          "border border-white/10 bg-gradient-to-b px-3 py-2 shadow-[0_14px_34px_-14px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)]",
          isBrowser ? "w-[440px] gap-1" : "w-[375px]",
        )}
      >
        {/* left */}
        <div className="flex gap-2">
          <AvatarIcon texture={texture} status={status} />
          <div className="flex min-w-[66px] flex-col gap-0.5 text-xs text-white">
            <div className="text-sm font-medium">{userName}</div>
            <div
              className="text-text-dim hover:text-app-text group flex cursor-pointer items-center gap-1 transition-colors"
              onClick={() => {
                gameScene.localPlayer.togglePlayerStatus();
              }}
            >
              <div className="capitalize">{status}</div>
              <AppIcon
                iconName="chevron-right"
                size={13}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </div>
          </div>
        </div>
        {/*  center */}
        <div
          className="flex flex-1 flex-col justify-center gap-0.5 text-xs text-white"
          style={{ fontFamily: "Retro" }}
        >
          <div className="flex items-center justify-center gap-1">
            <AppIcon iconName="room" size={16} className="text-accent-hi" />
            <div>{name}</div>
          </div>
          <div className="text-text-faint flex items-center justify-center gap-0.5 text-[11px]">
            <div className="flex w-8 items-center gap-1">
              <AppIcon iconName="people" size={13} />
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
              className={toggleClass(emoteWheelOpen)}
            >
              <div className="text-lg leading-none">😀</div>
            </TooltipButton>
          </Condition>

          <div className="relative">
            {/* 연결 안내 — 켜는 버튼 바로 위에 붙는 말풍선 */}
            <Condition condition={isBrowser && showLinkHint && !mediaConnected}>
              <div className="absolute bottom-[calc(100%+14px)] left-1/2 z-[45] w-max -translate-x-1/2">
                <div className="animate-hint-bob relative rounded-[11px] bg-white py-2 pl-3 pr-7 text-xs font-semibold leading-normal text-[#16171c] shadow-[0_10px_26px_-10px_rgba(0,0,0,0.55)] after:absolute after:-bottom-[5px] after:left-1/2 after:size-2.5 after:-translate-x-1/2 after:rotate-45 after:bg-white after:content-['']">
                  음성·영상을 켜두면, 가까이 갔을 때 바로 대화가 시작돼요
                  <button
                    className="absolute right-1.5 top-1.5 grid size-4 cursor-pointer place-items-center rounded text-black/40 hover:text-black"
                    onClick={() => setShowLinkHint(false)}
                  >
                    <AppIcon iconName="x-mark" size={13} />
                  </button>
                </div>
              </div>
            </Condition>
            <TooltipButton
              id="media-enabled"
              tooltip={
                isBrowser &&
                (mediaConnected ? "카메라 및 마이크 접근 거부" : "카메라 및 마이크 접근")
              }
              onClick={() => toggleMedia(mediaConnected)}
              className={toggleClass(mediaConnected)}
            >
              <AppIcon
                iconName={mediaConnected ? "link-on" : "link-off"}
                size={isBrowser ? 18 : 16}
              />
            </TooltipButton>
          </div>

          <TooltipButton
            id="camera-enabled"
            disabled={!mediaConnected}
            tooltip={isBrowser && `카메라 ${videoEnabled ? "비활성화" : "활성화"}`}
            onClick={() => toggleVideo(videoEnabled)}
            className={toggleClass(videoEnabled)}
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
            className={toggleClass(micEnabled)}
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
                    className="from-panel-top to-panel-bot hover:border-accent flex size-12 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-gradient-to-b text-2xl shadow-lg transition-all hover:scale-110 hover:shadow-[0_0_0_3px_rgba(86,101,214,0.36)]"
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
