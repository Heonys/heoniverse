import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AppIcon } from "@/icons";

// "다시 안 보기"를 누르면 이후 접속에서 입장 배너를 숨긴다 (WELCOME_KEY 패턴)
const HIDE_KEY = "heoniverse-mobile-notice-hidden";

type Props = {
  onClose?: () => void;
  useComputer?: boolean;
};

// 모바일 안내 — 두 모드:
// 1) 배너(기본): 입장 시 화면을 막지 않는 하단 배너. "안 되는 것"보다 "되는 것" 중심의 톤.
// 2) 컴퓨터 카드(useComputer): 컴퓨터 상호작용 차단 안내 + 화이트보드 대안 제시.
export const NonDesktop = ({ onClose, useComputer = false }: Props) => {
  const [isShow, setIsShow] = useState(() =>
    useComputer ? true : !localStorage.getItem(HIDE_KEY),
  );

  const handleClose = () => {
    if (onClose) onClose();
    setIsShow(false);
  };

  const handleNeverShow = () => {
    localStorage.setItem(HIDE_KEY, "1");
    handleClose();
  };

  if (useComputer) {
    return (
      <AnimatePresence>
        {isShow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] flex h-dvh w-full items-center justify-center bg-black/60 p-6 backdrop-blur-sm"
            onClick={handleClose}
          >
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              onClick={(e) => e.stopPropagation()}
              className="from-panel-top to-panel-bot w-full max-w-[340px] select-none rounded-[20px] border border-white/10 bg-gradient-to-b p-6 text-center shadow-[0_30px_70px_-20px_rgba(10,20,40,0.75),inset_0_1px_0_rgba(255,255,255,0.06)]"
            >
              <AppIcon iconName="desktop" size={34} className="text-accent-hi mx-auto" />
              <h2 className="mt-3 text-[16px] font-semibold tracking-[-0.01em] text-white">
                컴퓨터는 데스크탑 전용 기능입니다
              </h2>
              <p className="text-text-dim mt-2 text-[12.5px] leading-relaxed">
                화면 공유 기능이 모바일 브라우저에서는 지원되지 않습니다.
                <br />
                데스크탑 브라우저에서 접속하면 사용할 수 있습니다.
              </p>
              <div className="text-text-dim mt-3 inline-flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.04] px-3 py-1.5 text-[11.5px]">
                화이트보드는 모바일에서도 사용할 수 있습니다
              </div>
              <button
                className="bg-accent mt-4 inline-flex h-10 w-full cursor-pointer items-center justify-center rounded-xl text-[13.5px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition hover:brightness-[1.06]"
                onClick={handleClose}
              >
                확인
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isShow && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 14 }}
          className="fixed inset-x-3 bottom-[max(88px,calc(env(safe-area-inset-bottom)+80px))] z-[9999] select-none"
        >
          <div className="from-panel-top to-panel-bot mx-auto flex max-w-[380px] items-start gap-3 rounded-2xl border border-white/10 bg-gradient-to-b p-3.5 shadow-[0_14px_40px_-10px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)]">
            <AppIcon iconName="phone" size={20} className="text-accent-hi mt-0.5 flex-none" />
            <div className="min-w-0 flex-1">
              <div className="text-[13.5px] font-semibold text-white">
                데스크탑 환경에 최적화되어 있습니다
              </div>
              <p className="text-text-dim mt-0.5 text-[12px] leading-relaxed">
                모바일에서는 화면 공유·컴퓨터 등 일부 기능이 제한됩니다.
              </p>
              <p className="text-text-dim mt-0.5 text-[12px] leading-relaxed">
                이동·채팅·화상통화는 사용할 수 있습니다.
              </p>
              <div className="mt-2.5 flex gap-2">
                <button
                  className="bg-accent h-8 flex-1 cursor-pointer rounded-[10px] text-[12.5px] font-semibold text-white transition hover:brightness-[1.06]"
                  onClick={handleClose}
                >
                  확인
                </button>
                <button
                  className="text-text-dim hover:text-app-text h-8 cursor-pointer rounded-[10px] border border-white/10 px-3 text-[12.5px] transition-colors"
                  onClick={handleNeverShow}
                >
                  다시 안 보기
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
