import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@headlessui/react";
import { AppIcon } from "@/icons";
import { useAppDispatch, useAppSelector, useGame } from "@/hooks";
import { markAsRead, setFocusChat } from "@/stores/chatSlice";
import { ChatMessage } from "@/components/iphone";
import { StatusBar, BackChevron } from "./StatusBar";
import { setCurrentPage } from "@/stores/phoneSlice";
import { Condition } from "@/common";

type FormType = { message: string };

export const Chat = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { network, getLocalPlayer } = useGame();
  const dispatch = useAppDispatch();
  const { focused, chatMessages } = useAppSelector((state) => state.chat);
  const RoomName = useAppSelector((state) => state.room.name);
  const single = useAppSelector((state) => state.user.single);
  const { register, handleSubmit, setFocus, reset } = useForm<FormType>();

  const onSubmit = ({ message }: FormType) => {
    reset();
    if (!message.trim()) return;
    inputRef.current?.blur();
    network.sendMessage("PUSH_CHAT_MESSAGE", message);
    getLocalPlayer().openBubble(message);
  };

  const scrollToBottom = () => {
    // scrollIntoView는 폰 목업(overflow-hidden) 등 조상까지 스크롤시킨다 — 목록만 스크롤
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
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
      <div className="rounded-t-4xl relative flex flex-col font-bold text-black">
        <StatusBar />
        <div className="relative flex h-full flex-col items-center justify-center gap-1 text-black/70">
          <AppIcon iconName="user-cirlce" size={32} />
          <div className="text-[10px] font-medium">{RoomName}</div>
          <BackChevron onClick={() => dispatch(setCurrentPage({ page: "home" }))} />
        </div>
      </div>

      {/* center */}
      <div
        ref={listRef}
        className="flex h-full flex-1 flex-col gap-0.5 overflow-y-auto border-t border-black/15 bg-white p-2 outline-none"
        tabIndex={-1}
        onKeyDown={(e) => {
          if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            e.preventDefault();
          }
        }}
      >
        <ChatMessage
          key={-2}
          chatId={-2}
          messageType="JOINED"
          chatMessage={{
            clientId: getLocalPlayer().playerId,
            author: getLocalPlayer().playerName.text,
            content: "님이 입장하셨습니다",
            createdAt: new Date().getTime(),
          }}
        />
        <Condition condition={single}>
          <ChatMessage
            key={-1}
            chatId={-1}
            messageType="NOTICE"
            chatMessage={{
              clientId: getLocalPlayer().playerId,
              author: getLocalPlayer().playerName.text,
              content: "오프라인 모드에선 연결되지 않습니다",
              createdAt: new Date().getTime(),
            }}
          />
        </Condition>
        {chatMessages.map(({ id, type, message }, index) => {
          return <ChatMessage key={id} chatId={index} messageType={type} chatMessage={message} />;
        })}
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
            }
          }}
          onBlur={() => {
            dispatch(setFocusChat(false));
          }}
        />
      </form>
    </div>
  );
};
