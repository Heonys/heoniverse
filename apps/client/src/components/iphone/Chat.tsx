import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { Input } from "@headlessui/react";
import { AppIcon } from "@/icons";
import { useAppDispatch, useAppSelector, useCurrentTime, useGame } from "@/hooks";
import { markAsRead, setFocusChat } from "@/stores/chatSlice";
import { ChatMessage } from "@/components/iphone";
import { setCurrentPage } from "@/stores/phoneSlice";

type FormType = { message: string };

export const Chat = () => {
  const readyToSubmit = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const { network, getLocalPlayer } = useGame();
  const time = useCurrentTime();
  const dispatch = useAppDispatch();
  const { focused, chatMessages } = useAppSelector((state) => state.chat);
  const RoomName = useAppSelector((state) => state.room.name);
  const { register, handleSubmit, setFocus, reset } = useForm<FormType>();

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
    if (focused) setFocus("message");
  }, [focused, setFocus]);

  useEffect(() => {
    scrollToBottom();
    dispatch(markAsRead());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatMessages]);

  return (
    <div className="rounded-4xl flex size-full flex-col bg-white">
      {/* header */}
      <div className="rounded-t-4xl relative flex flex-col text-lg font-bold text-black">
        <div className="absolute left-1/2 top-2 h-[22px] w-20 -translate-x-1/2 rounded-full bg-[#040404]" />
        <div className="relative flex h-9 w-full items-center px-5 py-2 text-[13px]">
          <div className="ml-2">{format(time, "h:mm")}</div>
          <div className="flex flex-1 items-center justify-end gap-1.5">
            <AppIcon iconName="signal" size={14} />
            <AppIcon iconName="wifi" size={14} />
            <AppIcon iconName="batterty-half" size={16} />
          </div>
        </div>
        <div className="relative flex h-full flex-col items-center justify-center gap-1 text-black/70">
          <AppIcon iconName="user-cirlce" size={32} />
          <div className="text-[10px] font-medium">{RoomName}</div>
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer outline-none"
            onClick={() => dispatch(setCurrentPage({ page: "home" }))}
          >
            <AppIcon iconName="chevron-left" color="#0579fb" size={23} />
          </button>
        </div>
      </div>

      {/* center */}
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
            <ChatMessage key={index} chatId={index} messageType={type} chatMessage={message} />
          );
        })}
        <div ref={messageEndRef} />
      </div>

      {/* bottom */}
      <form
        className="rounded-b-4xl flex h-16 items-center gap-1.5 bg-white px-2"
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
  );
};
