import { useEffect } from "react";
import { AnimatePresence, motion, useAnimate } from "motion/react";
import { TooltipButton } from "@/common";
import { useAppDispatch, useAppSelector, useGame } from "@/hooks";
import { AppIcon } from "@/icons";
import { Pages, setShowIphone } from "@/stores/phoneSlice";
import { Home, Chat, IncomingCalls, Contacts, Dialing } from "@/components/iphone";

const pagesMap: Record<Pages, React.ComponentType<any>> = {
  home: Home,
  messages: Chat,
  contacts: Contacts,
  dialing: Dialing,
};

export const IphoneApp = () => {
  const dispatch = useAppDispatch();
  const { showIphone, currentPage, isRinging } = useAppSelector((state) => state.phone);
  const { chatMessages, lastReadAt } = useAppSelector((state) => state.chat);
  const [scope, animate] = useAnimate();
  const CurrentComponent = pagesMap[currentPage.page];

  const unReadMessageCount = chatMessages.filter((it) => {
    if (it.type === "CHAT" && it.message.createdAt > lastReadAt) return it;
  }).length;

  useEffect(() => {
    if (!scope.current) return;
    if (isRinging.state) {
      const controls = animate(
        scope.current,
        { x: [0, -2.5, 2.5, -1.5, 1.5, -0.5, 0.5, 0] },
        { duration: 0.4, repeat: Infinity, repeatType: "loop", repeatDelay: 0.75 },
      );
      return () => controls.stop();
    } else {
      animate(scope.current).stop();
    }
  }, [isRinging, scope, animate]);

  return (
    <div className="fixed bottom-2 left-0 select-none">
      <AnimatePresence>
        {showIphone ? (
          <motion.div
            ref={scope}
            className="relative h-[580px] w-[300px] overflow-hidden bg-contain bg-center bg-no-repeat"
            initial={{ y: 600, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 600, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            style={{ backgroundImage: showIphone ? "url('/svg/iphone15.svg')" : undefined }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage.page}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="-translate-1/2 absolute left-1/2 top-1/2 h-[552px] w-[253px]"
              >
                <CurrentComponent {...(currentPage.props || {})} />
              </motion.div>
            </AnimatePresence>
            <AnimatePresence>
              {isRinging.state && <IncomingCalls callerId={isRinging.caller} />}
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
