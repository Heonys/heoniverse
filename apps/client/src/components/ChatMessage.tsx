import { Tooltip } from "react-tooltip";
import { ChatType, IChatMessage } from "@heoniverse/shared";
import { cn, dateFormatter, pickColor } from "@/utils";
import { Condition } from "@/common";

type Props = {
  messageType: ChatType;
  chatMessage: IChatMessage;
};

export const ChatMessage = ({ messageType, chatMessage }: Props) => {
  return (
    <div
      className="flex flex-wrap rounded hover:bg-white/10"
      data-tooltip-id="chat-message-tooltip"
      data-tooltip-content={dateFormatter.format(chatMessage.createdAt)}
    >
      <Condition
        condition={messageType === "CHAT"}
        fallback={
          <div className="flex w-full items-center justify-center gap-1 px-1 py-0.5 text-sm text-white/50">
            <div className="underline">{chatMessage.author}</div>
            <div>{chatMessage.content}</div>
          </div>
        }
      >
        <span className="break-all py-1 text-sm text-white">
          <span
            className={cn("mx-1 mr-2 rounded px-1 text-black/70", pickColor(chatMessage.author))}
          >
            {chatMessage.author}
          </span>
          <span>{chatMessage.content}</span>
        </span>
      </Condition>

      <Tooltip
        id="chat-message-tooltip"
        className="!select-none !rounded !px-2 !py-1 !text-xs !text-white"
        place="right"
      />
    </div>
  );
};
