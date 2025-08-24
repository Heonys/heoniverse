import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { Input } from "@headlessui/react";
import { AppIcon } from "@/icons";
import { useAppDispatch, useAppSelector, useGame } from "@/hooks";
import { setShowChat, setFocusChat } from "@/stores/chatSlice";
import { ChatMessage } from "./ChatMessage";
import { TooltipButton } from "@/common";

type FormType = { message: string };

export const Chat = () => {
  const { network, getLocalPlayer } = useGame();
  const readyToSubmit = useRef(false);
  const [time, seTtime] = useState(new Date());
  const inputRef = useRef<HTMLInputElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { showChat, focused, chatMessages, lastReadAt } = useAppSelector((state) => state.chat);
  const RoomName = useAppSelector((state) => state.room.name);
  const { register, handleSubmit, setFocus, reset } = useForm<FormType>();

  const unReadMessageCount = chatMessages.filter((it) => {
    if (it.type === "CHAT" && it.message.createdAt > lastReadAt) return it;
  }).length;

  const onSubmit = ({ message }: FormType) => {
    if (!readyToSubmit.current) {
      readyToSubmit.current = true;
      return;
    }
    reset();
    if (!message.trim()) return;
    inputRef.current?.blur();
    network.sendMessage("PUSH_CHAT_MESSAGE", message);
    getLocalPlayer().openBubble(message);
  };

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      seTtime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (focused) setFocus("message");
  }, [focused, setFocus]);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, showChat]);

  return (
    <div className="fixed bottom-2 left-0 select-none">
      <AnimatePresence>
        {showChat ? (
          <motion.div
            className="h-[580px] w-[300px] bg-contain bg-center bg-no-repeat"
            initial={{ y: 600, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 600, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            style={{ backgroundImage: showChat ? "url('/svg/iphone15.svg')" : undefined }}
          >
            <div className="-translate-1/2 absolute left-1/2 top-1/2 flex h-[552px] w-[250px] flex-col">
              <div className="rounded-t-4xl relative flex h-24 flex-col bg-[#f7f7f7] text-lg font-bold text-black">
                <div className="absolute left-1/2 top-2 h-[22px] w-20 -translate-x-1/2 rounded-full bg-[#040404]" />
                <div className="px-4.5 relative flex h-9 w-full items-center py-2 text-[13px]">
                  <div className="">{format(time, "h:mm")}</div>
                  <div className="flex flex-1 items-center justify-end gap-1.5">
                    <AppIcon iconName="signal" size={14} />
                    <AppIcon iconName="wifi" size={14} />
                    <AppIcon iconName="batterty-half" size={16} />
                  </div>
                </div>
                <div className="relative flex h-full flex-col items-center justify-center gap-1 text-black/70">
                  <AppIcon iconName="user-cirlce" size={32} />
                  <div className="text-[10px] font-medium">{RoomName}</div>
                  <button className="absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer outline-none">
                    <AppIcon iconName="chevron-left" color="#0579fb" size={23} />
                  </button>
                </div>
              </div>
              <div
                className="flex h-full flex-1 flex-col gap-0.5 overflow-y-auto border-t border-black/15 bg-white p-2 outline-none"
                tabIndex={-1}
                onKeyDown={(e) => {
                  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                    e.preventDefault();
                  }
                }}
              >
                <ChatMessage
                  key={-1}
                  chatId={-1}
                  messageType="JOINED"
                  chatMessage={{
                    clientId: getLocalPlayer().playerId,
                    author: getLocalPlayer().playerName.text,
                    content: "님이 입장하셨습니다",
                    createdAt: new Date().getTime(),
                  }}
                />
                {chatMessages.map(({ type, message }, index) => {
                  return (
                    <ChatMessage
                      key={index}
                      chatId={index}
                      messageType={type}
                      chatMessage={message}
                    />
                  );
                })}
                <div ref={messageEndRef} />
              </div>
              <form
                className="rounded-b-4xl flex h-12 items-center gap-1.5 bg-white p-2"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="flex size-7 items-center justify-center rounded-full bg-[#e7e9eb] text-gray-500">
                  <AppIcon iconName="plus" size={12} />
                </div>
                <Input
                  type="text"
                  autoComplete="off"
                  placeholder="Message"
                  className="w-full flex-1 rounded-2xl border-2 border-black/15 px-3 py-1 text-xs text-black placeholder-gray-400 outline-0"
                  {...register("message")}
                  ref={(e) => {
                    register("message").ref(e);
                    inputRef.current = e as HTMLInputElement;
                  }}
                  onFocus={() => {
                    if (!focused) {
                      dispatch(setFocusChat(true));
                      readyToSubmit.current = true;
                    }
                  }}
                  onBlur={() => {
                    dispatch(setFocusChat(false));
                    readyToSubmit.current = false;
                  }}
                />
              </form>
            </div>
          </motion.div>
        ) : (
          <div className="absolute bottom-2 left-6 flex">
            <TooltipButton
              className="size-11"
              id="chat"
              tooltip="채팅창 열기"
              onClick={() => dispatch(setShowChat(true))}
            >
              <AppIcon iconName="chat" color="black" size={26} />
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
