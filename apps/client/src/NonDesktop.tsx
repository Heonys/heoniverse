import { useState } from "react";
import { AppIcon } from "@/icons";
import { motion } from "motion/react";
import { AnimatePresence } from "motion/react";
import { Condition } from "./common";

type Props = {
  onClose?: () => void;
  useComputer?: boolean;
};

export const NonDesktop = ({ onClose, useComputer = false }: Props) => {
  const [isShow, setIsShow] = useState(true);

  const handleClose = () => {
    if (onClose) onClose();
    setIsShow(false);
  };

  return (
    <AnimatePresence>
      {isShow && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bottom-0 left-0 right-0 top-0 z-[99999] flex h-screen w-full flex-col items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-xl border border-white/15 bg-white/5 p-6 backdrop-blur-3xl"
          >
            <button className="absolute right-2 top-2 cursor-pointer" onClick={handleClose}>
              <AppIcon iconName="x-mark" color="white" size={20} />
            </button>
            <div className="flex w-full select-none flex-col items-center gap-5">
              <div className="flex w-full flex-col space-y-1.5 text-left">
                <div className="flex items-center gap-1">
                  <AppIcon iconName="warning-tri" className="text-[#ffb056]" size={20} />
                  <h2 className="text-lg font-semibold leading-none tracking-tight text-white">
                    Desktop Recommended
                  </h2>
                </div>
                <p className="text-sm text-[#c2c2c2]">데스크탑 브라우저 사용을 권장합니다</p>
              </div>
              <div className="text-sm text-[#e0e0e0]">
                <Condition
                  condition={useComputer}
                  fallback={
                    <p>
                      이 서비스는 데스크탑 환경에 최적화되어 있습니다. 모바일 환경에선 일부 기능이
                      제한되기에 가능한 데스크탑 브라우저에서 접속해 주세요.
                    </p>
                  }
                >
                  <p>
                    컴퓨터 오브젝트와의 상호작용은 데스크탑 환경에 최적화되어 있습니다. 모바일
                    환경에선 제한되기에 데스크탑 브라우저에서 접속해 주세요.
                  </p>
                </Condition>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
