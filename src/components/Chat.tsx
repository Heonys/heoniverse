import { useForm } from "react-hook-form";
import { useEffect, useRef } from "react";
import { Input } from "@headlessui/react";
import { AppIcon, FloatingButton, IconButton } from "@/common";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { setShowChat, setFocusChat } from "@/stores/chatSlice";
import { phaserGame } from "@/game";
import { Game } from "@/game/scenes";
import { ChatMessage } from "@/components";

type FormType = { message: string };

export const Chat = () => {
  const game = phaserGame.scene.keys.game as Game;

  const readyToSubmit = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { showChat, focused, chatMessages } = useAppSelector((state) => state.chat);
  const { register, handleSubmit, setFocus, reset } = useForm<FormType>();

  const onSubmit = ({ message }: FormType) => {
    if (!readyToSubmit.current) {
      readyToSubmit.current = true;
      return;
    }
    reset();
    if (!message.trim()) return;
    inputRef.current?.blur();
    game.network.sendMessage("PUSH_CHAT_MESSAGE", message);
    game.localPlayer.openBubble(message);
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
    <div className="fixed left-0 bottom-10 w-[500px] h-[360px]">
      <div className="relative h-full flex flex-col p-5">
        {showChat ? (
          <>
            <div className="relative bg-black/70 rounded-t-xl h-10 flex justify-center items-center text-white text-lg font-bold">
              <div>Chat</div>
              <IconButton
                className="absolute top-0 right-0 p-2"
                onClick={() => dispatch(setShowChat(false))}
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
            <FloatingButton onClick={() => dispatch(setShowChat(true))}>
              <AppIcon iconName="chat" color="white" size={28} />
            </FloatingButton>
          </div>
        )}
      </div>
    </div>
  );
};
