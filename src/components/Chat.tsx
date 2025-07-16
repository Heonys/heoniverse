import { Input } from "@headlessui/react";
import { AppIcon, FloatingButton, IconButton } from "@/common";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { setShowChat } from "@/stores/chatSlice";

export const Chat = () => {
  const dispatch = useAppDispatch();
  const showChat = useAppSelector((state) => state.chat.showChat);

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
              <div className="bg-black/65 rounded-b-xl flex p-2 border-2 border-red-400 shadow-2xl">
                <Input
                  type="text"
                  autoComplete="off"
                  placeholder="Press Enter to chat"
                  className="w-full outline-0 placeholder-gray-400 placeholder:font-bold text-white"
                />
                <AppIcon iconName="smile" color="white" size={24} />
              </div>
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
