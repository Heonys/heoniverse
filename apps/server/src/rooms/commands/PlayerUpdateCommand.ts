import { Command } from "@colyseus/command";
import { Studio } from "../Studio";

type Payload = {
  sessionId: string;
  x: number;
  y: number;
  animKey: string;
};

export class PlayerUpdateCommand extends Command<Studio, Payload> {
  execute(payload: Payload) {
    const { sessionId, x, y, animKey } = payload;
    const player = this.state.players.get(sessionId);
    if (!player) return;

    player.x = x;
    player.y = y;
    player.animKey = animKey;
  }
}
