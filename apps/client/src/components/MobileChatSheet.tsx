import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "motion/react";
import { ChatType, IChatMessage } from "@heoniverse/shared";
import { useAppDispatch, useAppSelector, useGame } from "@/hooks";
import { markAsRead, setFocusChat, unreadMessageCount } from "@/stores/chatSlice";
import { setCurrentPage, setShowIphone } from "@/stores/phoneSlice";
import { AppIcon } from "@/icons";
import { AvatarIcon } from "./AvatarIcon";
// 배럴(@/components/iphone) 대신 파일 직접 import — IphoneApp↔시트 순환 참조 방지
import { MusicPlayer } from "./iphone/MusicPlayer";
import { Condition } from "@/common";
import { captureScreenshot } from "@/utils/captureScreenshot";
import { getScreenshots, removeScreenshot, type Screenshot } from "@/utils/screenshotStore";
import { eventEmitter } from "@/game/events";
import { cn } from "@/utils";

type FormType = { message: string };
type SheetTab = "chat" | "contacts" | "photos" | "music" | "camera";

// 모바일 전용 '폰' 시트 — 아이폰 목업 대신 앱 톤의 다크 하단 시트.
// 하단 독(dock)에 iOS풍 앱 아이콘(데스크탑 목업과 같은 에셋)을 두어 폰 메타포를 유지하고,
// 앱이 늘어나면 독에 아이콘을 추가해 확장한다. 채팅/발신 로직은 iphone/Chat·Contacts와 동일.
export const MobileChatSheet = () => {
  const listRef = useRef<HTMLDivElement>(null);
  const { network, getLocalPlayer } = useGame();
  const dispatch = useAppDispatch();
  const { chatMessages } = useAppSelector((state) => state.chat);
  const roomName = useAppSelector((state) => state.room.name);
  const single = useAppSelector((state) => state.user.single);
  const { register, handleSubmit, reset } = useForm<FormType>();
  const [tab, setTab] = useState<SheetTab>("chat");
  const localPlayerId = getLocalPlayer().playerId;
  const unread = useAppSelector((state) => unreadMessageCount(state, localPlayerId));

  const onSubmit = ({ message }: FormType) => {
    reset();
    if (!message.trim()) return;
    network.sendMessage("PUSH_CHAT_MESSAGE", message);
    getLocalPlayer().openBubble(message);
  };

  useEffect(() => {
    if (tab !== "chat") return;
    // scrollIntoView는 시트(overflow-hidden) 등 조상까지 스크롤시킨다 — 목록만 스크롤
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    dispatch(markAsRead());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatMessages, tab]);

  // 카메라 모드 — 시트를 하단 바로 접어 게임 화면이 뷰파인더가 된다
  if (tab === "camera") {
    return (
      <motion.div
        className="fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-[22px] border-t border-white/10 bg-[#16171d] shadow-[0_-18px_50px_-20px_rgba(0,0,0,0.8)]"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 200, damping: 26 }}
      >
        <div className="mx-auto mt-2 h-1 w-10 flex-none rounded-full bg-white/20" />
        <CameraBar onExit={() => setTab("photos")} />
      </motion.div>
    );
  }

  return (
    <motion.div
      className="fixed inset-x-0 bottom-0 z-50 flex h-[72dvh] flex-col rounded-t-[22px] border-t border-white/10 bg-[#16171d] shadow-[0_-18px_50px_-20px_rgba(0,0,0,0.8)]"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", stiffness: 200, damping: 26 }}
    >
      <div className="mx-auto mt-2 h-1 w-10 flex-none rounded-full bg-white/20" />

      {/* header — 방 이름 + 닫기 */}
      <div className="flex flex-none items-center justify-between border-b border-white/[0.07] px-4 pb-2 pt-1.5">
        <span className="text-[14px] font-semibold text-white">{roomName}</span>
        <button
          className="grid size-7 cursor-pointer place-items-center rounded-full bg-white/[0.06] text-white/70"
          onClick={() => dispatch(setShowIphone(false))}
          aria-label="닫기"
        >
          <AppIcon iconName="x-mark" size={16} />
        </button>
      </div>

      {tab === "chat" ? (
        <>
          {/* messages */}
          <div ref={listRef} className="flex flex-1 flex-col gap-2 overflow-y-auto px-3.5 py-3">
            <SystemLine text={`${getLocalPlayer().playerName.text} 님이 입장하셨습니다`} />
            <Condition condition={single}>
              <SystemLine text="오프라인 모드에선 연결되지 않습니다" />
            </Condition>
            {chatMessages.map(({ id, type, message }) => (
              <SheetMessage
                key={id}
                type={type}
                message={message}
                isMe={message.clientId === localPlayerId}
              />
            ))}
          </div>

          {/* input */}
          <form
            className="flex flex-none gap-2 border-t border-white/[0.07] px-3 py-2.5"
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              type="text"
              autoComplete="off"
              placeholder="메시지를 입력하세요"
              className="focus:border-accent w-full flex-1 rounded-xl border-[1.5px] border-white/10 bg-[#232530] px-3.5 py-2 text-[13.5px] text-white placeholder-gray-400 outline-0 transition-colors"
              {...register("message")}
              onFocus={() => dispatch(setFocusChat(true))}
              onBlur={() => dispatch(setFocusChat(false))}
            />
            <button
              type="submit"
              className="bg-accent grid w-11 flex-none cursor-pointer place-items-center rounded-xl text-white"
              aria-label="전송"
            >
              <AppIcon iconName="arrow-right" size={14} />
            </button>
          </form>
        </>
      ) : tab === "contacts" ? (
        <ContactsTab />
      ) : tab === "photos" ? (
        <PhotosTab />
      ) : (
        <div className="min-h-0 flex-1">
          <MusicPlayer />
        </div>
      )}

      <div className="flex flex-none items-center justify-around border-t border-white/[0.08] bg-[#14151c] px-3 pb-[max(10px,env(safe-area-inset-bottom))] pt-2.5">
        <DockItem
          img="/icons/messages.png"
          label="채팅"
          active={tab === "chat"}
          badge={unread}
          onClick={() => setTab("chat")}
        />
        <DockItem
          img="/icons/phone.png"
          label="전화"
          active={tab === "contacts"}
          onClick={() => setTab("contacts")}
        />
        <DockItem
          img="/icons/photos.png"
          label="사진"
          active={tab === "photos"}
          onClick={() => setTab("photos")}
        />
        <DockItem
          img="/icons/music.png"
          label="음악"
          active={tab === "music"}
          onClick={() => setTab("music")}
        />
        <DockItem img="/icons/camera.png" label="카메라" onClick={() => setTab("camera")} />
      </div>
    </motion.div>
  );
};

// 카메라 모드 하단 바 — 게임이 뷰파인더, 셔터는 P키와 같은 파이프라인
const CameraBar = ({ onExit }: { onExit: () => void }) => {
  const [lastShot, setLastShot] = useState<string | null>(null);

  const loadLast = () => {
    getScreenshots()
      .then((list) => {
        const latest = list.sort((a, b) => b.createdAt - a.createdAt)[0];
        setLastShot(latest?.dataUrl ?? null);
      })
      .catch(() => setLastShot(null));
  };

  useEffect(() => {
    loadLast();
    eventEmitter.on("SCREENSHOT_TAKEN", loadLast);
    return () => eventEmitter.off("SCREENSHOT_TAKEN", loadLast);
  }, []);

  return (
    <div className="flex items-center justify-between px-7 pb-[max(20px,env(safe-area-inset-bottom))] pt-3">
      <button
        className="relative size-11 cursor-pointer overflow-hidden rounded-[10px] border-[1.5px] border-white/25 bg-[#202126]"
        onClick={onExit}
        aria-label="사진 보기"
      >
        {lastShot && <img src={lastShot} alt="latest" className="size-full object-cover" />}
      </button>
      <button
        className="size-[62px] cursor-pointer rounded-full border-4 border-white/35 bg-white bg-clip-content p-0.5 transition-transform active:scale-90"
        onClick={captureScreenshot}
        aria-label="촬영"
      />
      <button
        className="grid size-11 cursor-pointer place-items-center rounded-full bg-white/[0.08] text-white"
        onClick={onExit}
        aria-label="카메라 종료"
      >
        <AppIcon iconName="x-mark" size={17} />
      </button>
    </div>
  );
};

// 사진 — 인게임 스크린샷 갤러리 (데스크탑 P키·카메라 앱과 같은 IndexedDB)
const PhotosTab = () => {
  const [shots, setShots] = useState<Screenshot[]>([]);
  const [selected, setSelected] = useState<Screenshot | null>(null);

  useEffect(() => {
    getScreenshots()
      .then((list) => setShots(list.sort((a, b) => b.createdAt - a.createdAt)))
      .catch((err) => console.error("스크린샷 로드 실패:", err));
  }, []);

  const download = (shot: Screenshot) => {
    const a = document.createElement("a");
    a.href = shot.dataUrl;
    a.download = `heoniverse-${shot.createdAt}.png`;
    a.click();
  };

  const remove = async (shot: Screenshot) => {
    await removeScreenshot(shot.id);
    setShots((prev) => prev.filter((s) => s.id !== shot.id));
    setSelected(null);
  };

  if (shots.length === 0) {
    return (
      <div className="text-text-faint flex flex-1 flex-col items-center justify-center gap-1.5 text-center text-[12.5px]">
        아직 사진이 없습니다
        <span className="text-[11px] text-white/35">카메라 앱으로 이 순간을 남겨보세요</span>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div className="grid flex-1 auto-rows-min grid-cols-3 gap-0.5 overflow-y-auto p-0.5">
        {shots.map((shot) => (
          <button
            key={shot.id}
            className="relative aspect-square cursor-pointer overflow-hidden rounded-sm"
            onClick={() => setSelected(shot)}
          >
            <img src={shot.dataUrl} alt="screenshot" className="size-full object-cover" />
          </button>
        ))}
      </div>
      {selected && (
        <div className="absolute inset-0 z-10 flex flex-col bg-black">
          <div className="flex min-h-0 flex-1 items-center justify-center p-2">
            <img
              src={selected.dataUrl}
              alt="screenshot"
              className="max-h-full max-w-full rounded-lg object-contain"
            />
          </div>
          <div className="flex flex-none justify-around py-2.5 text-[12px] text-[#0a84ff]">
            <button className="cursor-pointer" onClick={() => download(selected)}>
              다운로드
            </button>
            <button className="text-coral cursor-pointer" onClick={() => remove(selected)}>
              삭제
            </button>
            <button className="cursor-pointer text-white/60" onClick={() => setSelected(null)}>
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

type DockItemProps = {
  img: string;
  label: string;
  active?: boolean;
  badge?: number;
  disabled?: boolean;
  onClick?: () => void;
};

const DockItem = ({ img, label, active, badge, disabled, onClick }: DockItemProps) => (
  <button
    type="button"
    aria-label={label}
    disabled={disabled}
    onClick={onClick}
    className={cn(
      "relative flex cursor-pointer flex-col items-center gap-1 pb-1",
      disabled ? "cursor-default opacity-30" : !active && "opacity-75",
    )}
  >
    {/* 실제 아이폰처럼 아이콘이 타일을 꽉 채움 — 활성 표시는 아래 점(macOS 독 스타일) */}
    <img
      src={img}
      alt={label}
      draggable={false}
      className="size-12 rounded-[13px] shadow-[0_3px_8px_rgba(0,0,0,0.4)] active:scale-95"
    />
    <span
      className={cn(
        "size-1 rounded-full transition-colors",
        active ? "bg-white/90" : "bg-transparent",
      )}
    />
    {(badge ?? 0) > 0 && (
      <span className="bg-coral absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full border-2 border-[#16171d] px-1 text-[9px] font-bold text-white">
        {badge}
      </span>
    )}
  </button>
);

// 연락처 — 다른 플레이어에게 통화 발신 (iphone/Contacts.tsx의 발신 로직 재사용)
const ContactsTab = () => {
  const { getOtherPlayerById, network } = useGame();
  const dispatch = useAppDispatch();
  const { otherPlayersName } = useAppSelector((state) => state.user);
  const users = Object.entries(otherPlayersName).map(([id, name]) => ({ id, name }));

  if (users.length === 0) {
    return (
      <div className="text-text-faint flex flex-1 items-center justify-center text-[13px]">
        연락 가능한 인원이 없습니다
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-2 py-2">
      {users.map(({ id }) => {
        const player = getOtherPlayerById(id);
        if (!player) return null;
        return (
          <button
            key={id}
            className="flex cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2.5 text-left active:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={player.isCalling}
            onClick={() => {
              network.webRTC?.getUserMedia().then((allowed) => {
                if (!allowed) return;
                // 통화가 실제로 걸렸을 때만 통화 상태로 전환 (실패 시 발신자 고착 방지)
                const placed = network.webRTC?.peerCall(id, "direct");
                if (!placed) return;
                network.updateIsCalling(true);
                dispatch(setCurrentPage({ page: "dialing", props: { remoteId: player.playerId } }));
              });
            }}
          >
            <AvatarIcon texture={player.playerTexture} className="size-9" />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-1.5">
                <span className="truncate text-[13.5px] font-semibold text-white">
                  {player.playerName.text}
                </span>
                <span className="text-text-faint font-retro flex-none text-[10px]">{`#${player.playerId.slice(0, 6)}`}</span>
              </div>
              <div className={cn("text-[11px]", player.isCalling ? "text-coral" : "text-text-dim")}>
                {player.isCalling ? "통화 중" : "통화 가능"}
              </div>
            </div>
            <AppIcon iconName="pick-up" size={15} className="text-online flex-none" />
          </button>
        );
      })}
    </div>
  );
};

const SystemLine = ({ text }: { text: string }) => (
  <div className="text-text-faint py-0.5 text-center text-[11px]">{text}</div>
);

type MessageProps = { type: ChatType; message: IChatMessage; isMe: boolean };

const SheetMessage = ({ type, message, isMe }: MessageProps) => {
  const { isConnectedPlayer } = useGame();

  if (type !== "CHAT") {
    // JOINED/LEFT/NOTICE — 중앙 시스템 라인
    return (
      <SystemLine text={`${type === "NOTICE" ? "" : `${message.author} `}${message.content}`} />
    );
  }

  if (isMe) {
    return (
      <div className="flex justify-end">
        <span className="bg-accent max-w-[78%] break-all rounded-2xl rounded-br-md px-3 py-1.5 text-[13px] leading-relaxed text-white">
          {message.content}
        </span>
      </div>
    );
  }

  const player = isConnectedPlayer(message.clientId);
  return (
    <div className="flex items-end gap-1.5">
      <div className="grid size-7 flex-none place-items-center self-end">
        {player ? (
          <AvatarIcon texture={player.playerTexture} className="size-full" />
        ) : (
          <AppIcon iconName="user-cirlce" size={26} className="text-white/40" />
        )}
      </div>
      <div className="min-w-0">
        <div className="text-text-faint px-1 text-[10px]">{message.author}</div>
        <span className="mt-0.5 inline-block max-w-full break-all rounded-2xl rounded-bl-md bg-white/[0.08] px-3 py-1.5 text-[13px] leading-relaxed text-[#e8eaf0]">
          {message.content}
        </span>
      </div>
    </div>
  );
};
