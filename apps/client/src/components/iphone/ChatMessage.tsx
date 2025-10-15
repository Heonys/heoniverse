import { Tooltip } from "react-tooltip";
import { ChatType, IChatMessage } from "@heoniverse/shared";
import { dateFormatter } from "@/utils";
import { Condition } from "@/common";
import { useGame } from "@/hooks";
import { AppIcon } from "@/icons";
import { AvatarIcon } from "@/components";
import { OtherPlayer } from "@/game/characters";

type Props = {
  chatId: number;
  messageType: ChatType;
  chatMessage: IChatMessage;
};

export const ChatMessage = ({ chatId, messageType, chatMessage }: Props) => {
  const { getLocalPlayer, isConnectedPlayer } = useGame();
  const isMe = (id: string) => {
    return getLocalPlayer().playerId === id;
  };
  const player = isConnectedPlayer(chatMessage.clientId);

  return (
    <div
      className="flex flex-wrap rounded"
      data-tooltip-id={`chat-message-${chatId}`}
      data-tooltip-content={dateFormatter.format(chatMessage.createdAt)}
    >
      <Condition
        condition={messageType === "CHAT"}
        fallback={
          messageType === "JOINED" ? (
            <div className="flex w-full items-center justify-center gap-1 px-1 py-0.5 text-xs text-black/50">
              <div className="underline">{chatMessage.author}</div>
              <div>{chatMessage.content}</div>
            </div>
          ) : (
            <div className="flex w-full items-center justify-center gap-1 px-1 py-0.5 text-xs text-black/50">
              <AppIcon iconName="warning-tri" className="text-[#ffb056]" size={20} />
              <div>{chatMessage.content}</div>
            </div>
          )
        }
      >
        <div className="flex w-full items-center gap-1 break-all py-1 text-xs">
          {isMe(chatMessage.clientId) ? (
            <MessageBubbleSelf message={chatMessage.content} />
          ) : (
            <MessageBubbleOther
              author={chatMessage.author}
              message={chatMessage.content}
              player={player}
            />
          )}
        </div>
      </Condition>

      <Tooltip
        id={`chat-message-${chatId}`}
        className="!select-none !rounded !px-2 !py-1 !text-xs !text-white"
        place="right"
      />
    </div>
  );
};

type OtherMessage = {
  author: string;
  message: string;
  player?: OtherPlayer;
};

const MessageBubbleOther = ({ author, message, player }: OtherMessage) => {
  return (
    <>
      <div className="mx-1 mb-1 flex size-7 items-center justify-center self-end rounded-full font-medium text-black/70">
        {player ? (
          <AvatarIcon texture={player.playerTexture} className="size-full" />
        ) : (
          <AppIcon iconName="user-cirlce" size={28} />
        )}
      </div>
      <div className="flex flex-1 flex-col">
        <div className="px-1 text-[10px]">{author}</div>
        <div className="flex flex-1 items-center justify-start">
          <span className="rounded-lg rounded-bl-none bg-[#e9e9eb] p-1 px-2 text-black/90">
            {message}
          </span>
        </div>
      </div>
    </>
  );
};

const MessageBubbleSelf = ({ message }: { message: string }) => {
  return (
    <div className="flex flex-1 items-center justify-end">
      <span className="rounded-lg rounded-br-none bg-[#1b8dfd] p-1 px-2 text-white/90">
        {message}
      </span>
    </div>
  );
};
