import { useEffect } from "react";
import { isBrowser } from "react-device-detect";
import { AnimatePresence, motion, useAnimate } from "motion/react";
import { Condition, TooltipButton } from "@/common";
import { useAppDispatch, useAppSelector, useGame } from "@/hooks";
import { AppIcon } from "@/icons";
import { Pages, setShowIphone } from "@/stores/phoneSlice";
import { unreadMessageCount } from "@/stores/chatSlice";
import { Home, Chat, IncomingCalls, Contacts, Dialing } from "@/components/iphone";
import { MobileChatSheet } from "@/components/MobileChatSheet";
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
  const dispatch = useAppDispatch();
  const { showIphone, currentPage, isRinging, isConnected } = useAppSelector(
    (state) => state.phone,
  );
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

  // 모바일에서 통화를 수락하면(시트 닫힘 상태여도) 통화 화면은 떠 있어야 한다
  const sheetVisible =
    showIphone || (!isBrowser && currentPage.page === "dialing" && isConnected.state);

  return (
    <div className={cn("fixed left-0 z-50 select-none", isBrowser ? "bottom-2" : "bottom-18")}>
      {/* 모바일 수신 배너 — 시트 열림 여부와 무관하게 상단 표시 */}
      <Condition condition={!isBrowser}>
        <AnimatePresence>
          {isRinging.state && (
            <div className="fixed inset-x-0 top-16 z-[85] h-14">
              <IncomingCalls callerId={isRinging.caller} />
            </div>
          )}
        </AnimatePresence>
      </Condition>

      <AnimatePresence>
        {sheetVisible ? (
          isBrowser ? (
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
          ) : currentPage.page === "dialing" ? (
            /* 모바일 통화 화면 — 다크 시트에 기존 Dialing 재사용 */
            <motion.div
              key="mobile-dialing"
              className="fixed inset-x-0 bottom-0 z-50 h-[62dvh] overflow-hidden rounded-t-[22px] border-t border-white/10 bg-[#101116] shadow-[0_-18px_50px_-20px_rgba(0,0,0,0.8)]"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 200, damping: 26 }}
            >
              <CurrentComponent {...(currentPage.props || {})} />
            </motion.div>
          ) : (
            /* 모바일 채팅 — 아이폰 목업 대신 앱 톤의 다크 시트 */
            <MobileChatSheet key="mobile-chat" />
          )
        ) : (
          /* 닫힌 상태 버튼은 데스크탑 전용 — 모바일은 HUD 슬림바의 채팅 버튼이 대체 */
          <Condition condition={isBrowser}>
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
            </div>
          </Condition>
        )}
      </AnimatePresence>
    </div>
  );
};
