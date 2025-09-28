import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AppIcon } from "@/icons";

export const GameNoti = () => {
  const [showMessage, setShowMessage] = useState(true);

  return (
    <div className="fixed right-1 top-1 flex select-none flex-col items-end gap-2">
      <AnimatePresence>
        {showMessage && (
          <motion.div
            className="text-smite relative flex w-[340px] flex-col gap-1 rounded-md bg-black/60 p-4 text-sm backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              className="absolute right-1 top-1 cursor-pointer"
              onClick={() => setShowMessage(false)}
            >
              <AppIcon iconName="x-mark" color="white" size={19} />
            </button>
            <div className="flex items-center gap-2 text-blue-300">
              <AppIcon iconName="help" size={18} />
              <div className="font-semibold leading-none tracking-tight">영상·음성 접근 허용</div>
            </div>
            <div className="text-[#c2c2c2]">
              카메라와 마이크를 연결하면, 주변 플레이어와 더욱 원활하게 소통할 수 있습니다.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
