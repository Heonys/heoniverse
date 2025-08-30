import { Command } from "@colyseus/command";
import { Studio } from "../Studio";

type Payload = {
  sessionId: string;
  whiteboardId: string;
  connect: boolean;
};

export class WhiteboardUpdateCommand extends Command<Studio, Payload> {
  execute(payload: Payload) {
    const { sessionId, whiteboardId, connect } = payload;
    const whiteboard = this.state.whiteboards.get(whiteboardId);

    if (connect) {
      if (!whiteboard || whiteboard.connectedUser.has(sessionId)) return;
      whiteboard.connectedUser.add(sessionId);
    } else {
      whiteboard?.connectedUser.delete(sessionId);
    }
  }
}
