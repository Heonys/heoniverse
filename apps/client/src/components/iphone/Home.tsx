import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { motion, animate, useMotionValue } from "motion/react";
import { useAppDispatch, useAppSelector, useCurrentTime, useGame } from "@/hooks";
import { AppIcon } from "@/icons";
import { Pages, setCurrentPage } from "@/stores/phoneSlice";
import { StatusBar } from "./StatusBar";
import { AvatarIcon } from "@/components/AvatarIcon";
import { getScreenshots } from "@/utils/screenshotStore";
import { eventEmitter } from "@/game/events";
import { cn } from "@/utils";

const PAGE_SPRING = { type: "spring", stiffness: 320, damping: 32 } as const;

export const Home = () => {
  const { getLocalPlayer, getOtherPlayerById } = useGame();
  const time = useCurrentTime();
  const dispatch = useAppDispatch();
  const { chatMessages, lastReadAt } = useAppSelector((state) => state.chat);
  const roomName = useAppSelector((state) => state.room.name);
  const { otherPlayersName } = useAppSelector((state) => state.user);

  // 좌우 스와이프 페이지 (0: 앱, 1: 위젯)
  const [page, setPage] = useState(0);
  const x = useMotionValue(0);
  const viewRef = useRef<HTMLDivElement>(null);
  const [pageWidth, setPageWidth] = useState(0);
  // 스와이프 직후 위젯·아이콘 클릭 오발동 방지
  const suppressClick = useRef(false);

  const [lastShot, setLastShot] = useState<string | null>(null);

  const unReadMessageCount = chatMessages.filter(
    (it) =>
      it.type === "CHAT" &&
      it.message.clientId !== getLocalPlayer().playerId &&
      it.message.createdAt > lastReadAt,
  ).length;
  const playerCount = Object.keys(otherPlayersName).length + 1;
  const avatarTextures = [
    getLocalPlayer().playerTexture,
    ...Object.keys(otherPlayersName).map((id) => getOtherPlayerById(id)?.playerTexture),
  ].filter(Boolean) as string[];

  useEffect(() => {
    setPageWidth(viewRef.current?.clientWidth ?? 0);
  }, []);

  useEffect(() => {
    const load = () => {
      getScreenshots()
        .then((list) => {
          const latest = list.sort((a, b) => b.createdAt - a.createdAt)[0];
          setLastShot(latest?.dataUrl ?? null);
        })
        .catch(() => setLastShot(null));
    };
    load();
    eventEmitter.on("SCREENSHOT_TAKEN", load);
    return () => eventEmitter.off("SCREENSHOT_TAKEN", load);
  }, []);

  const goPage = (target: number) => {
    setPage(target);
    animate(x, -target * pageWidth, PAGE_SPRING);
  };

  const openApp = (target: Pages) => () => {
    if (suppressClick.current) return;
    dispatch(setCurrentPage({ page: target }));
  };

  return (
    <div
      className="rounded-4xl flex size-full flex-col bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/background/iphone-wallpaper.webp')" }}
    >
      {/* header */}
      <StatusBar tone="dark" />

      {/* 페이지 스와이프 영역 */}
      <div ref={viewRef} className="relative min-h-0 flex-1 overflow-hidden">
        <motion.div
          className="flex h-full"
          style={{ x }}
          drag="x"
          dragConstraints={{ left: -pageWidth, right: 0 }}
          dragElastic={0.16}
          dragMomentum={false}
          onDragEnd={(_, info) => {
            suppressClick.current = Math.abs(info.offset.x) > 8;
            setTimeout(() => (suppressClick.current = false), 0);
            let target = page;
            if (info.offset.x < -40 || info.velocity.x < -300) target = 1;
            else if (info.offset.x > 40 || info.velocity.x > 300) target = 0;
            goPage(target);
          }}
        >
          {/* 1페이지 — 위젯 + 앱 그리드 */}
          <div className="flex h-full w-full flex-none flex-col gap-3 p-3">
            <div className="grid grid-cols-2 place-items-center">
              <div className="flex size-[106px] flex-col rounded-3xl bg-gradient-to-b from-blue-900 to-sky-300 p-2.5 text-[10px] text-white">
                <div className="ml-1 pb-2 text-3xl">23°</div>
                <AppIcon iconName="cloud" size={17} />
                <div className="">대체로 흐림</div>
                <div className="">최고 23° 최저 18°</div>
              </div>
              <div className="size-[106px] rounded-3xl bg-white p-3.5 text-[10px]">
                <div>{format(time, "EEEE", { locale: ko })}</div>
                <div className="pb-3 text-2xl">{format(time, "d", { locale: ko })}</div>
                <div className="text-black/70">오늘 이벤트 없음</div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-y-2">
              <div
                className="group flex cursor-pointer flex-col items-center gap-1"
                onClick={openApp("photos")}
              >
                <img
                  src="/icons/photos.png"
                  draggable={false}
                  className="no-pixel size-13 group-hover:brightness-80 transition-all"
                  alt="photos"
                />
                <div className="text-[10px] text-white">사진</div>
              </div>
              <div
                className="group flex cursor-pointer flex-col items-center gap-1"
                onClick={openApp("camera")}
              >
                <img
                  src="/icons/camera.png"
                  draggable={false}
                  className="no-pixel size-13 group-hover:brightness-80 transition-all"
                  alt="camera"
                />
                <div className="text-[10px] text-white">카메라</div>
              </div>
              <div
                className="group flex cursor-pointer flex-col items-center gap-1"
                onClick={openApp("music")}
              >
                <img
                  src="/icons/music.png"
                  draggable={false}
                  className="no-pixel size-13 group-hover:brightness-80 transition-all"
                  alt="music"
                />
                <div className="text-[10px] text-white">음악</div>
              </div>
            </div>
          </div>

          {/* 2페이지 — 위젯 */}
          <div className="flex h-full w-full flex-none flex-col gap-3 p-3">
            <button
              className="h-[120px] w-full cursor-pointer overflow-hidden rounded-3xl bg-black/30"
              onClick={openApp("photos")}
            >
              {lastShot ? (
                <img
                  src={lastShot}
                  draggable={false}
                  className="size-full object-cover"
                  alt="최근 사진"
                />
              ) : (
                <div className="grid size-full place-items-center text-[10px] text-white/60">
                  아직 사진이 없습니다
                </div>
              )}
            </button>
            <div className="grid grid-cols-2 place-items-center">
              <div className="flex size-[106px] flex-col justify-between rounded-3xl bg-white p-3.5 text-[10px]">
                <div className="truncate font-bold">{roomName}</div>
                <div className="flex -space-x-2.5">
                  {avatarTextures.slice(0, 3).map((texture, i) => (
                    <AvatarIcon
                      key={i}
                      texture={texture}
                      className="size-9 rounded-full border-2 border-white bg-[#dde3ec] p-1"
                    />
                  ))}
                  {playerCount > 3 && (
                    <div className="grid size-9 place-items-center rounded-full border-2 border-white bg-[#e2e6ee] text-[10px] font-bold text-black/60">
                      +{playerCount - 3}
                    </div>
                  )}
                </div>
                <div className="text-[10.5px] text-black/60">
                  <span className="text-[13px] font-extrabold text-black">{playerCount}명</span>{" "}
                  접속 중
                </div>
              </div>
              {/* 장식용 (미구현) — iOS 주식 위젯 패러디 */}
              <div className="flex size-[106px] flex-col rounded-3xl bg-[#111]/90 p-3.5 text-[10px] text-white">
                <div className="flex items-baseline justify-between">
                  <span className="text-[11px] font-extrabold">HEON</span>
                  <span className="text-[8.5px] text-white/40">Heoniverse</span>
                </div>
                <svg className="mt-auto w-full" viewBox="0 0 80 24">
                  <polyline
                    points="0,20 10,15 20,17 30,10 40,13 50,6 60,9 70,3 80,5"
                    fill="none"
                    stroke="#30d158"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="mt-1.5 flex items-end justify-between">
                  <span className="text-[14px] font-bold leading-none">128.31</span>
                  <span className="rounded-[5px] bg-[#30d158] px-1 py-0.5 text-[8.5px] font-bold">
                    +4.2%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 페이지 인디케이터 */}
      <div className="flex flex-none items-center justify-center gap-1.5 pb-1.5 pt-0.5">
        {[0, 1].map((i) => (
          <button
            key={i}
            className={cn(
              "size-1.5 cursor-pointer rounded-full transition-colors",
              page === i ? "bg-white/90" : "bg-white/35",
            )}
            onClick={() => goPage(i)}
            aria-label={`${i + 1}페이지`}
          />
        ))}
      </div>

      {/* bottom */}
      <div className="h-17 m-2 mt-0 flex items-center justify-center gap-1 overflow-hidden rounded-[32px] bg-white/25 text-white backdrop-blur-3xl">
        <img
          src="/icons/phone.png"
          className="no-pixel size-13 hover:brightness-80 cursor-pointer transition-all"
          alt="phone"
          onClick={() => dispatch(setCurrentPage({ page: "contacts" }))}
        />
        <div className="relative">
          <img
            src="/icons/messages.png"
            className="no-pixel size-13 hover:brightness-80 cursor-pointer transition-all"
            alt="messages"
            onClick={() => dispatch(setCurrentPage({ page: "messages" }))}
          />
          {unReadMessageCount > 0 && (
            <div className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-red-500 p-1 text-xs text-white">
              {unReadMessageCount}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
