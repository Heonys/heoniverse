import { useEffect, useRef, useState } from "react";
import { AppIcon } from "@/icons";
import { TrafficLights } from "@/components/computer";
import { useAppDispatch, useAppSelector, useGame } from "@/hooks";
import { formattDate } from "@/utils";
import { markAsRead } from "@/stores/chatSlice";

export const Messages = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const roomName = useAppSelector((state) => state.room.name);
  const [text, setText] = useState("");

  const chatMessages = useAppSelector((state) => state.chat.chatMessages);
  const dispatch = useAppDispatch();
  const { getLocalPlayer, network } = useGame();
  const lastMessage = chatMessages[chatMessages.length - 1];

  const isMe = (id: string) => {
    return getLocalPlayer().playerId === id;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    network.sendMessage("PUSH_CHAT_MESSAGE", text);
    setText("");
  };

  const scrollToBottom = () => {
    const container = containerRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  return (
    <div className="h-full w-full overflow-hidden rounded-2xl bg-[#1e1e1e]/75 backdrop-blur-sm">
      <div className="draggable-area relative top-0 grid h-7 w-full cursor-move grid-cols-3 text-center">
        <div className="relative">
          <TrafficLights id="messages" onClose={() => dispatch(markAsRead())} />
        </div>
        <div className="col-span-2 bg-[#1e1e1e]" />
      </div>
      <div className="grid h-[calc(100%-28px)] select-none grid-cols-3">
        <div className="flex h-full flex-col gap-1 p-2 text-white">
          <div className="h-15 relative flex cursor-pointer items-center gap-2 rounded-md bg-gray-100/10 px-2 py-1">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gray-500 text-[10px]">
              <div className="font-semibold">{roomName.split(" ")[0]}</div>
            </div>
            <div className="min-w-0 truncate px-2 text-xs">
              {lastMessage ? lastMessage.message.content : "메시지가 없습니다"}
            </div>
            <div className="absolute right-1 top-1 text-[10px] text-white/60">
              {lastMessage && formattDate(lastMessage.message.createdAt)}
            </div>
          </div>
        </div>
        <div className="col-span-2 flex h-full flex-col overflow-y-auto bg-[#1e1e1e] text-white">
          {/* header */}
          <div className="flex h-9 items-center border-b border-gray-100/20 px-2 shadow-2xl">
            <div className="flex items-center gap-2 text-sm text-white/90">
              <AppIcon iconName="edit" size={18} />
              <div className="font-semibold">Messages</div>
            </div>
            <div className="flex flex-auto justify-end gap-3 px-1">
              <AppIcon iconName="video" size={18} />
              <AppIcon iconName="info" size={18} />
            </div>
          </div>
          <div className="h-full flex-1 overflow-y-auto p-3 text-sm" ref={containerRef}>
            {chatMessages.map(({ type, message }, index) => {
              if (type === "CHAT") {
                return isMe(message.clientId) ? (
                  <MessageBubbleSelf key={index} message={message.content} />
                ) : (
                  <MessageBubbleOther
                    key={index}
                    author={message.author}
                    message={message.content}
                  />
                );
              } else {
                return (
                  <div className="flex items-center justify-center">
                    <div className="flex gap-1 px-1 py-0.5 text-sm text-white/80">
                      <div className="underline">{message.author}</div>
                      <div>{message.content}</div>
                    </div>
                  </div>
                );
              }
            })}
          </div>
          {/* input */}
          <form
            className="flex h-10 items-center gap-3 px-3 text-sm text-white"
            onSubmit={handleSubmit}
          >
            <div className="flex items-center justify-center rounded-full bg-[#3e3e3e] p-1 text-white/60">
              <AppIcon iconName="plus" size={12} />
            </div>
            <div className="relative w-full">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full rounded-xl bg-[#3e3e3e] px-3 py-1 pr-9 outline-none"
                placeholder="Message"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                <AppIcon iconName="voice" size={17} />
              </span>
            </div>
            <AppIcon iconName="emoji" size={20} />
          </form>
        </div>
      </div>
    </div>
  );
};

const MessageBubbleOther = ({ author, message }: { author: string; message: string }) => {
  return (
    <div className="flex">
      <span className="mb-auto border-b-2 border-white/90 p-1 text-xs">{author}</span>
      <div className="flex flex-1 flex-wrap items-center gap-2 p-1.5">
        <span className="rounded-xl bg-[#3e3e3e] p-1 px-3 text-white/90">{message}</span>
      </div>
    </div>
  );
};

const MessageBubbleSelf = ({ message }: { message: string }) => {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2 p-1.5">
      <span className="rounded-xl bg-[#0084ff] p-1 px-3 text-white/90">{message}</span>
    </div>
  );
};
