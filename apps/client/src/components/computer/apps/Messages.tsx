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
  const { localPlayer, network } = useGame();
  const lastMessage = chatMessages[chatMessages.length - 1];

  const isMe = (id: string) => {
    return localPlayer.playerId === id;
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
    <div className="w-full h-full bg-[#1e1e1e]/75 backdrop-blur-sm overflow-hidden rounded-2xl">
      <div className="relative grid grid-cols-3 draggable-area text-center top-0 h-7 w-full cursor-move">
        <div className="relative">
          <TrafficLights id="messages" onClose={() => dispatch(markAsRead())} />
        </div>
        <div className="col-span-2 bg-[#1e1e1e]" />
      </div>
      <div className="h-[calc(100%-28px)] grid grid-cols-3 select-none">
        <div className="h-full flex flex-col gap-1 p-2 text-white">
          <div className="relative px-2 py-1 rounded-md bg-gray-100/10 h-15 flex items-center gap-2 cursor-pointer">
            <div className="text-[10px] bg-gray-500 rounded-full size-9 flex justify-center items-center shrink-0">
              <div className="font-semibold">{roomName.split(" ")[0]}</div>
            </div>
            <div className="text-xs truncate px-2 min-w-0">
              {lastMessage ? lastMessage.message.content : "메시지가 없습니다"}
            </div>
            <div className="absolute right-1 top-1 text-[10px] text-white/60">
              {lastMessage && formattDate(lastMessage.message.createdAt)}
            </div>
          </div>
        </div>
        <div className="col-span-2 bg-[#1e1e1e] text-white h-full flex flex-col overflow-y-auto">
          {/* header */}
          <div className="flex items-center h-9 border-b border-gray-100/20 shadow-2xl px-2">
            <div className="flex gap-2 items-center text-sm text-white/90">
              <AppIcon iconName="edit" size={18} />
              <div className="font-semibold">Messages</div>
            </div>
            <div className="flex flex-auto justify-end gap-3 px-1">
              <AppIcon iconName="video" size={18} />
              <AppIcon iconName="info" size={18} />
            </div>
          </div>
          <div className="text-sm p-3 flex-1 h-full overflow-y-auto" ref={containerRef}>
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
                  <div className="flex justify-center items-center">
                    <div className="text-white/80 text-sm flex gap-1 py-0.5 px-1">
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
            className="h-10 text-white flex items-center text-sm px-3 gap-3"
            onSubmit={handleSubmit}
          >
            <div className="bg-[#3e3e3e] text-white/60 rounded-full p-1 flex justify-center items-center">
              <AppIcon iconName="plus" size={12} />
            </div>
            <div className="relative w-full">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="bg-[#3e3e3e] rounded-xl py-1 px-3 outline-none w-full pr-9"
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
      <span className="text-xs p-1 mb-auto border-b-2 border-white/90">{author}</span>
      <div className="flex items-center flex-wrap p-1.5 gap-2 flex-1">
        <span className="rounded-xl p-1 px-3 text-white/90 bg-[#3e3e3e]">{message}</span>
      </div>
    </div>
  );
};

const MessageBubbleSelf = ({ message }: { message: string }) => {
  return (
    <div className="flex items-center flex-wrap p-1.5 gap-2 justify-end">
      <span className="rounded-xl p-1 px-3 text-white/90 bg-[#0084ff]">{message}</span>
    </div>
  );
};
