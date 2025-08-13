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
    <div className="fixed bottom-0 left-0 h-[360px] w-[500px] select-none">
      <div className="relative flex h-full flex-col p-5">
        {showChat ? (
          <>
            <div className="relative flex h-10 items-center justify-center rounded-t-xl bg-black/70 text-lg font-bold text-white">
              <div>Chat</div>
              <IconButton className="absolute right-0 top-0 p-2" onClick={handleClose}>
                <AppIcon iconName="x-mark" size={25} />
              </IconButton>
            </div>

            <div className="h-full flex-1 overflow-y-auto border border-black/15 bg-neutral-800 p-2">
              {chatMessages.map(({ type, message }, index) => {
                return <ChatMessage key={index} messageType={type} chatMessage={message} />;
              })}
              <div ref={messageEndRef} />
            </div>
            <form
              className="flex h-10 items-center rounded-b-xl border-2 border-red-400 bg-black/65 p-2 shadow-2xl"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Input
                type="text"
                autoComplete="off"
                placeholder="Press Enter to chat"
                className="w-full px-1 text-white placeholder-gray-400 outline-0 placeholder:font-bold"
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
          </>
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
