import { Command } from "@colyseus/command";
import { Studio } from "../Studio";
import { ChatMessage } from "../schema/StudioState";

type Payload = {
  sessionId: string;
  message: string;
};

export class PushChatUpdateCommand extends Command<Studio, Payload> {
  execute(payload: Payload) {
    const { sessionId, message } = payload;
    const player = this.state.players.get(sessionId);
    const messages = this.state.messages;
    if (!player) return;

    if (messages.length >= 100) messages.shift();

    const newMessage = new ChatMessage();
    newMessage.clientId = sessionId;
    newMessage.author = player.name;
    newMessage.content = message;
    messages.push(newMessage);
  }
}
