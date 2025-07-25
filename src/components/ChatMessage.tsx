import { Tooltip } from "react-tooltip";
import { ChatType, IChatMessage } from "@server/src/types";
import { cn, dateFormatter, pickColor } from "@/utils";
import { Condition } from "@/common";

type Props = {
  messageType: ChatType;
  chatMessage: IChatMessage;
};

export const ChatMessage = ({ messageType, chatMessage }: Props) => {
  return (
    <div
      className="flex flex-wrap hover:bg-white/10 rounded"
      data-tooltip-id="chat-message-tooltip"
      data-tooltip-content={dateFormatter.format(chatMessage.createdAt)}
    >
      <Condition
        condition={messageType === "CHAT"}
        fallback={
          <div className="text-white/50 text-sm flex gap-1 py-0.5 px-1 w-full justify-center items-center">
            <div className="underline">{chatMessage.author}</div>
            <div>{chatMessage.content}</div>
          </div>
        }
      >
        <span className="py-1 break-all text-white text-sm">
          <span
            className={cn("mx-1 rounded px-1 text-black/70 mr-2", pickColor(chatMessage.author))}
          >
            {chatMessage.author}
          </span>
          <span>{chatMessage.content}</span>
        </span>
      </Condition>

      <Tooltip
        id="chat-message-tooltip"
        className="!text-white !text-xs !rounded !px-2 !py-1 !shadow-lg !select-none"
        place="right"
        data-tooltip-variant="dark"
      />
    </div>
  );
};
