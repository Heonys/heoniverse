import { Tooltip } from "react-tooltip";
import { ChatType, IChatMessage } from "@server/src/types";
import { dateFormatter } from "@/utils";

type Props = {
  messageType: ChatType;
  chatMessage: IChatMessage;
};

export const ChatMessage = ({ chatMessage }: Props) => {
  return (
    <div
      className="flex flex-wrap hover:bg-white/10 rounded"
      data-tooltip-id="chat-message-tooltip"
      data-tooltip-content={dateFormatter.format(chatMessage.createdAt)}
    >
      <span className="py-1 break-words text-white text-sm ">
        <span className="bg-rose-400 mx-1 rounded px-1">{chatMessage.author}</span>
        <span>{chatMessage.content}</span>
      </span>

      <Tooltip
        id="chat-message-tooltip"
        className="!text-white !text-xs !rounded !px-2 !py-1 !shadow-lg !select-none"
        place="right"
        data-tooltip-variant="dark"
      />
    </div>
  );
};
