import { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Condition, TooltipButton } from "@/common";
import { TrafficLights } from "@/components/computer";
import { useAppDispatch, useAppSelector, useGame } from "@/hooks";
import { AppIcon } from "@/icons";
import { currentSharing, setJoinedSharing } from "@/stores/computerSlice";
import { ScreenSharingAlert } from "@/components/computer/apps";

export const ScreenSharing = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useAppDispatch();
  const sharing = useAppSelector(currentSharing);
  const joinedSharing = useAppSelector((state) => state.computer.joinedSharing);
  const { network, getLocalPlayer } = useGame();

  const isMe = sharing && sharing.sharingUserId === getLocalPlayer().playerId;

  return (
    <div className="h-full w-full overflow-hidden rounded-2xl bg-[#1e1e1e]">
      <div className="draggable-area relative top-0 flex h-7 w-full cursor-move items-center">
        <div className="relative h-full w-20">
          <TrafficLights
            id="screen-sharing"
            onClose={() => {
              if (isMe) network.webRTC?.stopScreenShare();
              dispatch(setJoinedSharing(false));
            }}
          />
        </div>
        <div className="flex-1 text-sm text-white">
          {sharing && `${sharing.sharingUserId}님의 화면`}
        </div>
      </div>
      <div
        className="relative h-[calc(100%-28px)] select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.video
          ref={videoRef}
          className="size-full"
          autoPlay
          initial={{ opacity: 0 }}
          animate={{ opacity: sharing ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />
        <div className="fixed bottom-3 right-3 z-[9999] flex gap-2">
          <Condition condition={isMe && isHovered}>
            <TooltipButton
              id="desktop-screen-share"
              tooltip="stop sharing"
              onClick={() => {
                network.webRTC?.stopScreenShare();
                if (videoRef.current) videoRef.current.srcObject = null;
                dispatch(setJoinedSharing(false));
              }}
            >
              <AppIcon iconName="screen-share-off" color="black" size={25} />
            </TooltipButton>
          </Condition>
        </div>

        <AnimatePresence>
          {!sharing && (
            <ScreenSharingAlert
              title="화면 공유를 위한 권한 요청"
              description="공유할 화면을 선택하면 다른 플레이어가 볼 수 있습니다"
              confirmText="공유 시작"
              onConfirm={() => {
                network.webRTC?.startScreenShare().then((stream) => {
                  dispatch(setJoinedSharing(true));
                  if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                  }
                });
              }}
            />
          )}
          {sharing && !joinedSharing && (
            <ScreenSharingAlert
              title={`${sharing.sharingUserId}님의 화면 공유`}
              description="계속하려면 참여하기를 눌러 화면공유에 참여하세요"
              confirmText="참여하기"
              onConfirm={() => {
                if (network.webRTC?.screenStream) {
                  dispatch(setJoinedSharing(true));
                  if (videoRef.current) {
                    videoRef.current.srcObject = network.webRTC.screenStream;
                  }
                }
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
