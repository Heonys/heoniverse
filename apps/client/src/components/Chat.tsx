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

  // const handleClose = () => {
  //   dispatch(setShowChat(false));
  //   dispatch(markAsRead());
  // };

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
    <div className="fixed bottom-0 left-0 h-[560px] w-[330px] select-none">
      <div className="relative flex h-full flex-col p-5">
        <AnimatePresence>
          {showChat ? (
            <motion.div
              key="chat-phone"
              initial={{ y: 600, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 600, opacity: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              className="relative flex h-full flex-col rounded-[45px] border-8 border-[#040404] bg-white"
            >
              <div className="relative mt-1 flex h-24 flex-col overflow-hidden rounded-t-[36px] bg-[#f7f7f7] text-lg font-bold text-black">
                <div className="w-22 absolute left-1/2 top-2 h-[22px] -translate-x-1/2 rounded-full bg-[#040404]"></div>
                <div className="relative flex h-8 w-full items-center p-3 px-6 text-[13px] font-semibold">
                  <div className="">{format(time, "h:mm")}</div>
                  <div className="flex flex-1 items-center justify-end gap-1.5">
                    <AppIcon iconName="signal" size={14} />
                    <AppIcon iconName="wifi" size={14} />
                    <AppIcon iconName="batterty-half" size={18} />
                  </div>
                </div>
                <div className="flex h-full flex-col items-center justify-center gap-1 text-black/70">
                  <AppIcon iconName="user-cirlce" size={32} />
                  <div className="text-xs font-medium">Public Room</div>
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
                className="mb-2 flex h-12 items-center gap-1.5 rounded-b-[38px] bg-white p-2"
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
            </motion.div>
          ) : (
            <div className="absolute bottom-2 left-6 flex">
              <TooltipButton
                className="size-11"
                id="chat"
                tooltip="채팅창 활성화"
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
    </div>
  );
};
