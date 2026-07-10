import { isBrowser } from "react-device-detect";
import { TooltipButton } from "@/common";
import { useAppDispatch, useModal } from "@/hooks";
import { AppIcon } from "@/icons";
import { closeWhiteboardDialog } from "@/stores/whiteboardSlice";
import { WhiteBoard } from "./WhiteBoard";

export const WhiteboardDialog = () => {
  const dispatch = useAppDispatch();
  const { showModal } = useModal();

  // 모바일 — 베젤 없이 풀스크린, 닫기 FAB 하나만 (가이드 모달은 데스크탑 조작 설명이라 제외)
  if (!isBrowser) {
    return (
      <div className="fixed inset-0 z-[9999] h-dvh bg-white">
        <WhiteBoard />
        <button
          className="fixed bottom-[max(76px,calc(env(safe-area-inset-bottom)+68px))] right-3 z-[10000] grid size-11 cursor-pointer place-items-center rounded-full bg-[#14151c]/85 text-white shadow-lg backdrop-blur"
          onClick={() => dispatch(closeWhiteboardDialog())}
          aria-label="화이트보드 닫기"
        >
          <AppIcon iconName="x-mark" size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-xs fixed left-0 top-0 z-[9999] h-full w-full p-5">
      <div className="relative h-full w-full overflow-hidden rounded-[24px] border-[1.5px] border-neutral-400/60 bg-[#030303] p-2.5 shadow-2xl">
        <WhiteBoard />
      </div>
      <div className="fixed bottom-2 right-5 z-[9999] flex gap-2">
        <TooltipButton
          id="whiteboard-help"
          tooltip="조작 가이드"
          onClick={() => {
            showModal("WhiteboardGuide");
          }}
        >
          <AppIcon iconName="help" color="black" size={25} />
        </TooltipButton>
        <TooltipButton
          id="whiteboard-exit"
          tooltip="Exit Board"
          onClick={() => {
            dispatch(closeWhiteboardDialog());
          }}
        >
          <AppIcon iconName="exit" color="black" size={25} />
        </TooltipButton>
      </div>
    </div>
  );
};
