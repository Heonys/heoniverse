import { Command } from "@colyseus/command";
import { Status } from "../../../../../packages/shared";
import { Studio } from "../Studio";

type Payload = {
  sessionId: string;
  status: Status;
};

export class PlayerUpdateStatus extends Command<Studio, Payload> {
  execute(payload: Payload) {
    const { sessionId, status } = payload;
    const player = this.state.players.get(sessionId);
    if (!player) return;
    player.status = status;
  }
}
