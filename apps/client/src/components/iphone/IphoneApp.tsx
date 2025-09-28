import { useEffect, useState } from "react";
import { isBrowser } from "react-device-detect";
import NumberFlow from "@number-flow/react";
import { AnimatePresence, motion, useAnimate } from "motion/react";
import { Condition, TooltipButton } from "@/common";
import { useAppDispatch, useAppSelector, useGame, useModal, useSceneEffect } from "@/hooks";
import { AppIcon } from "@/icons";
import { Pages, setShowIphone } from "@/stores/phoneSlice";
import { Home, Chat, IncomingCalls, Contacts, Dialing } from "@/components/iphone";
import { cn } from "@/utils";

const pagesMap: Record<Pages, React.ComponentType<any>> = {
  home: Home,
  messages: Chat,
  contacts: Contacts,
  dialing: Dialing,
};

export const IphoneApp = () => {
  const { gameScene, getLocalPlayer } = useGame();
  const { showModal } = useModal();
  const dispatch = useAppDispatch();
  const { showIphone, currentPage, isRinging } = useAppSelector((state) => state.phone);
  const { chatMessages, lastReadAt } = useAppSelector((state) => state.chat);
  const [scope, animate] = useAnimate();
  const CurrentComponent = pagesMap[currentPage.page];

  const [users, setUsers] = useState(0);

  useSceneEffect(gameScene, () => {
    setUsers(gameScene.ohterPlayersMap.size + 1);
  }, []);

  const unReadMessageCount = chatMessages.filter((it) => {
    return it.type === "CHAT" && it.message.createdAt > lastReadAt;
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
    <div className={cn("fixed left-0 z-50 select-none", isBrowser ? "bottom-2" : "bottom-18")}>
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
            <Condition condition={!isBrowser}>
              <div className="absolute right-0 top-0">
                <TooltipButton
                  className="size-9"
                  id="close-phone"
                  tooltip="휴대폰 닫기"
                  onClick={() => dispatch(setShowIphone(false))}
                >
                  <AppIcon iconName="exit" color="black" size={24} />
                </TooltipButton>
              </div>
            </Condition>
          </motion.div>
        ) : (
          <div className="absolute bottom-2 left-6 flex gap-2">
            <TooltipButton
              className="size-11"
              id="phone"
              tooltip="휴대폰 열기"
              onClick={() => {
                getLocalPlayer().isPhoneAnimating = true;
                dispatch(setShowIphone(true));
              }}
            >
              <AppIcon iconName="phone" color="black" size={28} />
              {unReadMessageCount > 0 && (
                <div className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-red-500 p-1 text-xs text-white">
                  {unReadMessageCount}
                </div>
              )}
            </TooltipButton>

            <Condition condition={!isBrowser}>
              <TooltipButton
                id="users"
                tooltip="플레이어 목록"
                onClick={() => {
                  showModal("JoinedUsers");
                }}
              >
                <AppIcon iconName="people" color="black" size={25} />
                <div className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-slate-600 p-1 text-xs text-white">
                  <NumberFlow value={users} />
                </div>
              </TooltipButton>
            </Condition>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
