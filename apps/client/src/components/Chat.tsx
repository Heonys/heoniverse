import { useForm } from "react-hook-form";
import { useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";
import { Button, Input } from "@headlessui/react";
import { AppIcon, IconButton } from "@/icons";
import { useAppDispatch, useAppSelector, useGame } from "@/hooks";
import { setShowChat, setFocusChat, markAsRead } from "@/stores/chatSlice";
import { ChatMessage } from "./ChatMessage";

type FormType = { message: string };

export const Chat = () => {
  const { network, localPlayer } = useGame();

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
    localPlayer.openBubble(message);
  };

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (focused) setFocus("message");
  }, [focused, setFocus]);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, showChat]);

  return (
    <div className="fixed left-0 bottom-10 w-[500px] h-[360px] select-none">
      <div className="relative h-full flex flex-col p-5">
        {showChat ? (
          <>
            <div className="relative bg-black/70 rounded-t-xl h-10 flex justify-center items-center text-white text-lg font-bold">
              <div>Chat</div>
              <IconButton
                className="absolute top-0 right-0 p-2"
                onClick={() => {
                  dispatch(setShowChat(false));
                  dispatch(markAsRead());
                }}
              >
                <AppIcon iconName="x-mark" size={25} />
              </IconButton>
            </div>

            <div className="flex-1 h-full bg-neutral-800 p-2 overflow-y-auto border border-black/15">
              {chatMessages.map(({ type, message }, index) => {
                return <ChatMessage key={index} messageType={type} chatMessage={message} />;
              })}
              <div ref={messageEndRef} />
            </div>
            <form
              className="bg-black/65 rounded-b-xl h-10 flex p-2 border-2 border-red-400 shadow-2xl items-center"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Input
                type="text"
                autoComplete="off"
                placeholder="Press Enter to chat"
                className="w-full outline-0 placeholder-gray-400 placeholder:font-bold text-white px-1"
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
            <Button
              className={twMerge(
                "z-50 w-13 h-13",
                "relative rounded-full bg-neutral-700 shadow-xl cursor-pointer select-none",
                "flex items-center justify-center",
                "hover:bg-neutral-800 transition-colors duration-300",
              )}
              onClick={() => dispatch(setShowChat(true))}
            >
              <AppIcon iconName="chat" color="white" size={28} />
              {unReadMessageCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 size-5 p-1 rounded-full flex justify-center items-center text-white text-xs">
                  {unReadMessageCount}
                </div>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
