import { useAppDispatch, useAppSelector, useGame } from "@/hooks";
import { closeApp } from "@/stores/desktopSlice";
import { motion } from "motion/react";
import { useEffect } from "react";

type AlertProps = {
  onConfirm: () => void;
};

export const ScreenShareAlert = ({ onConfirm }: AlertProps) => {
  const dispatch = useAppDispatch();

  return (
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
        <img src="/icons/screen-sharing.webp" className="no-pixel size-22" alt="screen-sharing" />
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
          onClick={() => dispatch(closeApp("screen-sharing"))}
        >
          취소
        </button>
        <button
          className="cursor-pointer rounded-md border border-black/20 bg-[#f5f5f5] p-1 px-2 shadow-2xl hover:bg-white"
          onClick={onConfirm}
        >
          공유 시작
        </button>
      </div>
    </motion.div>
  );
};

type JoinAlertProps = {
  sharingId: string;
  onConfirm: () => void;
};

export const ScreenShareJoinAlert = ({ sharingId, onConfirm }: JoinAlertProps) => {
  const dispatch = useAppDispatch();
  const computerId = useAppSelector((state) => state.computer.computerId);
  const { network } = useGame();

  useEffect(() => {
    network.screenSharingRequest(computerId!, sharingId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
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
        <img src="/icons/screen-sharing.webp" className="no-pixel size-22" alt="screen-sharing" />
        <div className="flex flex-col gap-0.5 text-sm">
          <div className="font-semibold">{`${sharingId}님의 화면 공유`}</div>
          <div className="text-xs text-black/80">
            계속하려면 참여하기를 눌러 화면공유에 참여하세요
          </div>
        </div>
      </div>
      <div className="absolute bottom-3 right-5 flex gap-3 text-xs font-semibold text-black/70">
        <button
          className="cursor-pointer rounded-md border border-black/20 bg-[#f5f5f5] p-1 px-2 shadow-2xl hover:bg-white"
          onClick={() => dispatch(closeApp("screen-sharing"))}
        >
          취소
        </button>
        <button
          className="cursor-pointer rounded-md border border-black/20 bg-[#f5f5f5] p-1 px-2 shadow-2xl hover:bg-white"
          onClick={onConfirm}
        >
          참여하기
        </button>
      </div>
    </motion.div>
  );
};
