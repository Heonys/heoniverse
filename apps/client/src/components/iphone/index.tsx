import { AnimatePresence, motion } from "motion/react";
import { TooltipButton } from "@/common";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { AppIcon } from "@/icons";
import { setShowIphone } from "@/stores/phoneSlice";
import { Home } from "./Home";
import { Chat } from "./Chat";

export const Iphone = () => {
  const dispatch = useAppDispatch();
  const { showIphone, currentPage } = useAppSelector((state) => state.phone);
  const { chatMessages, lastReadAt } = useAppSelector((state) => state.chat);

  const unReadMessageCount = chatMessages.filter((it) => {
    if (it.type === "CHAT" && it.message.createdAt > lastReadAt) return it;
  }).length;

  return (
    <div className="fixed bottom-2 left-0 select-none">
      <AnimatePresence>
        {showIphone ? (
          <motion.div
            className="h-[580px] w-[300px] bg-contain bg-center bg-no-repeat"
            initial={{ y: 600, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 600, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            style={{ backgroundImage: showIphone ? "url('/svg/iphone15.svg')" : undefined }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0"
              >
                {currentPage === "home" && <Home />}
                {currentPage === "messages" && <Chat />}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="absolute bottom-2 left-6 flex gap-2">
            <TooltipButton
              className="size-11"
              id="phone"
              tooltip="휴대폰 열기"
              onClick={() => dispatch(setShowIphone(true))}
            >
              <AppIcon iconName="phone" color="black" size={28} />
              {unReadMessageCount > 0 && (
                <div className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-red-500 p-1 text-xs text-white">
                  {unReadMessageCount}
                </div>
              )}
            </TooltipButton>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
