import { useForm } from "react-hook-form";
import { useEffect, useRef } from "react";
import { Input } from "@headlessui/react";
import { AppIcon, IconButton } from "@/icons";
import { useAppDispatch, useAppSelector, useGame } from "@/hooks";
import { setShowChat, setFocusChat, markAsRead } from "@/stores/chatSlice";
import { ChatMessage } from "./ChatMessage";
import { TooltipButton } from "@/common";

type FormType = { message: string };

export const Chat = () => {
  const { network, getLocalPlayer } = useGame();

  const readyToSubmit = useRef(false);
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

  const handleClose = () => {
    dispatch(setShowChat(false));
    dispatch(markAsRead());
  };

  useEffect(() => {
    if (focused) setFocus("message");
  }, [focused, setFocus]);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, showChat]);

  return (
    <div className="fixed bottom-0 left-0 h-[550px] w-[330px] select-none">
      <div className="relative flex h-full flex-col p-5">
        {showChat ? (
          <div className="rounded-4xl relative flex h-full flex-col border-[7px] border-black">
            <div className="relative flex h-10 items-center justify-center rounded-t-3xl bg-[#f7f7f7] text-lg font-bold text-black">
              {/* <IconButton className="absolute right-0 top-0 p-2" onClick={handleClose}>
                <AppIcon iconName="x-mark" size={25} />
              </IconButton> */}
              <div className="text-sm">Public Room</div>
            </div>
            <div className="flex h-full flex-1 flex-col gap-0.5 overflow-y-auto border-t border-black/15 bg-white p-2">
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
              className="flex h-12 items-center gap-1.5 rounded-b-3xl bg-white p-2"
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
        ) : (
          <div className="mt-auto">
            <TooltipButton
              className="size-11"
              id="chat"
              tooltip="chat"
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
      </div>
    </div>
  );
};
