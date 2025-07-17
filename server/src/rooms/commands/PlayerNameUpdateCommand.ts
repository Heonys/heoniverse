import { Command } from "@colyseus/command";
import { Studio } from "../Studio";

type Payload = {
  sessionId: string;
  name: string;
};

export class PlayerNameUpdateCommand extends Command<Studio, Payload> {
  execute(payload: Payload) {
    const { sessionId, name } = payload;
    const player = this.state.players.get(sessionId);
    if (!player) return;

    player.name = name;
  }
}
