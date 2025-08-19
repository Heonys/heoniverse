import { useRef, useState } from "react";
import Webcam from "react-webcam";
import NumberFlow from "@number-flow/react";
import { AppIcon } from "@/icons";
import { AvatarIcon } from "./AvatarIcon";
import { useAppDispatch, useAppSelector, useGame, useSceneEffect } from "@/hooks";
import { cn } from "@/utils";
import { TooltipButton } from "@/common";
import { setMicEnabled, setViedeoEnabled } from "@/stores/userSlice";
import { createPortal } from "react-dom";
import { SelfVideo } from "./webcam/SelfVideo";

// TODO: 생성 및 제거시 애니메이션 추가
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

  const handleMicToggle = async (isMute: boolean) => {
    if (videoRef.current) {
      const stream = videoRef.current.stream;
      if (stream) {
        const audioTrack = stream.getAudioTracks()[0];
        audioTrack.enabled = !isMute;
      }
    }
  };

  const handleVideoToggle = (isEnabled: boolean) => {
    if (videoRef.current) {
      const stream = videoRef.current.stream;
      if (stream) {
        const videoTrack = stream.getVideoTracks()[0];
        videoTrack.enabled = isEnabled;
      }
    }
  };

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
            id="joystick"
            tooltip={`${mediaConnected ? "카메라 및 마이크 접근 거부" : "카메라 및 마이크 접근"}`}
            onClick={() => {
              if (mediaConnected) {
                network.webRTC?.disConnectUserMedia();
              } else {
                network.webRTC?.getUserMedia();
              }
            }}
            className={cn(
              "size-9 transition-all",
              mediaConnected ? "bg-slate-500/70 text-white" : "bg-white/90 text-black",
            )}
          >
            <AppIcon iconName={mediaConnected ? "link-on" : "link-off"} size={20} />
          </TooltipButton>

          <TooltipButton
            id="joystick"
            disabled={!mediaConnected}
            tooltip={`마이크 ${micEnabled ? "비활성화" : "활성화"}`}
            onClick={() => {
              if (micEnabled) {
                dispatch(setMicEnabled(false));
                handleMicToggle(true);
              } else {
                dispatch(setMicEnabled(true));
                handleMicToggle(false);
              }
            }}
            className={cn(
              "size-9 transition-all",
              micEnabled ? "bg-slate-500/70 text-white" : "bg-white/90 text-black",
            )}
          >
            <AppIcon iconName={micEnabled ? "mic-on" : "mic-off"} size={20} />
          </TooltipButton>

          <TooltipButton
            id="joystick"
            disabled={!mediaConnected}
            tooltip={`카메라 ${videoEnabled ? "비활성화" : "활성화"}`}
            onClick={() => {
              if (videoEnabled) {
                dispatch(setViedeoEnabled(false));
                handleVideoToggle(false);
              } else {
                dispatch(setViedeoEnabled(true));
                handleVideoToggle(true);
              }
            }}
            className={cn(
              "size-9 transition-all",
              videoEnabled ? "bg-slate-500/70 text-white" : "bg-white/90 text-black",
            )}
          >
            <AppIcon iconName={videoEnabled ? "video-on" : "video-off"} size={20} />
          </TooltipButton>
        </div>
      </div>
      {createPortal(
        <div className="absolute left-1/2 top-3 flex -translate-x-1/2 gap-2">
          {mediaConnected && <SelfVideo ref={videoRef} />}
        </div>,
        document.getElementById("webcam-container")!,
      )}
    </>
  );
};
