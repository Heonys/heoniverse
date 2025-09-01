import { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Condition, TooltipButton } from "@/common";
import { TrafficLights } from "@/components/computer";
import { useAppDispatch, useAppSelector, useGame } from "@/hooks";
import { closeApp } from "@/stores/desktopSlice";
import { AppIcon } from "@/icons";
import { currentSharing } from "@/stores/computerSlice";

export const ScreenSharing = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const sharing = useAppSelector(currentSharing);
  const dispatch = useAppDispatch();
  const { network } = useGame();

  return (
    <div className="h-full w-full overflow-hidden rounded-2xl bg-[#1e1e1e]">
      <div className="draggable-area relative top-0 flex h-7 w-full cursor-move items-center">
        <div className="relative h-full w-20">
          <TrafficLights id="screen-sharing" onClose={() => network.webRTC?.stopScreenShare()} />
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
          <Condition condition={sharing && isHovered}>
            <TooltipButton
              id="desktop-screen-share"
              tooltip="stop sharing"
              onClick={() => {
                network.webRTC?.stopScreenShare();
                if (videoRef.current) videoRef.current.srcObject = null;
              }}
            >
              <AppIcon iconName="screen-share-off" color="black" size={25} />
            </TooltipButton>
          </Condition>
        </div>

        <AnimatePresence>
          {!sharing && (
            <motion.div
              className="-translate-1/2 top-2/5 absolute left-1/2 h-[170px] w-[450px] rounded-2xl border border-black/10 bg-[#eeeef0] shadow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="border-b-2 border-black/10 p-1 text-center text-sm font-semibold text-black/70">
                Screen Sharing
              </div>
              <div className="flex items-center gap-2 px-2">
                <img
                  src="/icons/screen-sharing.webp"
                  className="no-pixel size-22"
                  alt="screen-sharing"
                />
                <div className="flex flex-col gap-0.5 text-sm">
                  <div className="font-semibold">화면 공유를 위한 권한 요청</div>
                  <div className="text-xs text-black/80">
                    공유할 화면을 선택하면 다른 플레이어가 볼 수 있습니다
                  </div>
                </div>
              </div>
              <div className="absolute bottom-3 right-5 flex gap-3 text-xs font-semibold text-black/70">
                <button
                  className="cursor-pointer rounded-md border border-black/20 bg-[#f5f5f5] p-1 px-2 shadow-2xl hover:bg-white"
                  onClick={() => {
                    dispatch(closeApp("screen-sharing"));
                  }}
                >
                  취소
                </button>
                <button
                  className="cursor-pointer rounded-md border border-black/20 bg-[#f5f5f5] p-1 px-2 shadow-2xl hover:bg-white"
                  onClick={() => {
                    network.webRTC?.startScreenShare().then((stream) => {
                      if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                      }
                    });
                  }}
                >
                  공유 시작
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
