import { useEffect } from "react";
import { isBrowser } from "react-device-detect";
import NumberFlow from "@number-flow/react";
import { AnimatePresence, motion, useAnimate } from "motion/react";
import { Condition, TooltipButton } from "@/common";
import { useAppDispatch, useAppSelector, useGame, useModal } from "@/hooks";
import { AppIcon } from "@/icons";
import { Pages, setShowIphone } from "@/stores/phoneSlice";
import { unreadMessageCount } from "@/stores/chatSlice";
import { Home, Chat, IncomingCalls, Contacts, Dialing } from "@/components/iphone";
import { cn, helperButtonClass } from "@/utils";

const pagesMap: Record<Pages, React.ComponentType<any>> = {
  home: Home,
  messages: Chat,
  contacts: Contacts,
  dialing: Dialing,
};

const PRELOAD_IMAGES = [
  "/images/background/iphone-wallpaper.webp",
  "/svg/iphone15.svg",
  "/icons/phone.png",
  "/icons/messages.png",
  "/icons/note.png",
  "/icons/photos.png",
  "/icons/maps.png",
  "/icons/music.png",
];

export const IphoneApp = () => {
  const { getLocalPlayer } = useGame();
  const { showModal } = useModal();
  const dispatch = useAppDispatch();
  const { showIphone, currentPage, isRinging } = useAppSelector((state) => state.phone);
  const users = useAppSelector((state) => Object.keys(state.user.otherPlayersName).length + 1);
  const localPlayerId = getLocalPlayer().playerId;
  const unReadMessageCount = useAppSelector((state) => unreadMessageCount(state, localPlayerId));
  const [scope, animate] = useAnimate();
  const CurrentComponent = pagesMap[currentPage.page];

  useEffect(() => {
    PRELOAD_IMAGES.forEach((src) => {
      new Image().src = src;
    });
  }, []);

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
            {/* 닫기 — Esc가 없는 모바일 전용 */}
            <Condition condition={!isBrowser}>
              <div className="absolute right-0.5 top-0.5">
                <TooltipButton
                  className={cn(helperButtonClass(), "size-8 rounded-lg")}
                  id="close-phone"
                  onClick={() => dispatch(setShowIphone(false))}
                >
                  <AppIcon iconName="x-mark" size={18} />
                </TooltipButton>
              </div>
            </Condition>
          </motion.div>
        ) : (
          <div className="absolute bottom-2 left-6 flex items-center gap-2">
            <TooltipButton
              className={helperButtonClass()}
              id="phone"
              tooltip={isBrowser && "스마트폰 열기 (Enter: 채팅)"}
              onClick={() => {
                getLocalPlayer().isPhoneAnimating = true;
                dispatch(setShowIphone(true));
              }}
            >
              <AppIcon iconName="phone" size={22} />
              {unReadMessageCount > 0 && (
                <div className="bg-coral absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full border-2 border-white p-1 text-[11px] font-bold text-white">
                  {unReadMessageCount}
                </div>
              )}
            </TooltipButton>

            <Condition condition={!isBrowser}>
              <TooltipButton
                className={helperButtonClass()}
                id="left-users"
                tooltip="플레이어 목록"
                onClick={() => {
                  showModal("JoinedUsers");
                }}
              >
                <AppIcon iconName="people" size={21} />
                <div className="bg-accent absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full border-2 border-white p-1 text-[11px] font-bold text-white">
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
