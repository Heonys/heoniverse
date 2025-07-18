import { useForm } from "react-hook-form";
import { useEffect, useRef } from "react";
import { Input } from "@headlessui/react";
import { AppIcon, FloatingButton, IconButton } from "@/common";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { setShowChat, setFocusChat } from "@/stores/chatSlice";

type FormType = { message: string };

export const Chat = () => {
  const dispatch = useAppDispatch();
  const showChat = useAppSelector((state) => state.chat.showChat);
  const focused = useAppSelector((state) => state.chat.focused);
  const chatMessage = useAppSelector((state) => state.chat.chatMessages);

  const readyToSubmit = useRef(false);
  const { register, handleSubmit, setFocus, reset } = useForm<FormType>();

  const onSubmit = ({ message }: FormType) => {
    if (!readyToSubmit.current) {
      readyToSubmit.current = true;
      return;
    }
    /*
      Send the message to the server.
      Show the chat bubble to the client.
    */
    reset();
  };

  useEffect(() => {
    if (focused) setFocus("message");
  }, [focused, setFocus]);

  return (
    <div className="fixed left-0 bottom-12 w-[500px] h-full max-h-1/2">
      <div className="relative p-5 h-full flex flex-col">
        {showChat ? (
          <>
            <div className="relative h-10 bg-black/70 rounded-t-xl flex items-center justify-center text-white text-lg font-bold">
              <div className="">Chat</div>
              <IconButton
                className="absolute top-0 right-0 p-2"
                onClick={() => dispatch(setShowChat(false))}
              >
                <AppIcon iconName="x-mark" size={25} />
              </IconButton>
            </div>
            <div className="flex-auto">
              <div className="h-full bg-neutral-800"></div>
              <form
                className="bg-black/65 rounded-b-xl flex p-2 border-2 border-red-400 shadow-2xl"
                onSubmit={handleSubmit(onSubmit)}
              >
                <Input
                  type="text"
                  autoComplete="off"
                  placeholder="Press Enter to chat"
                  className="w-full outline-0 placeholder-gray-400 placeholder:font-bold text-white"
                  {...register("message")}
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
                <AppIcon iconName="smile" color="white" size={24} />
              </form>
            </div>
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
