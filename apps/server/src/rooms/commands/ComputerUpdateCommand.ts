import { Command } from "@colyseus/command";
import { Studio } from "../Studio";

type Payload = {
  sessionId: string;
  computerId: string;
  connect: boolean;
};

export class ComputerUpdateCommand extends Command<Studio, Payload> {
  execute(payload: Payload) {
    const { sessionId, computerId, connect } = payload;
    const computer = this.state.computers.get(computerId);

    if (connect) {
      if (!computer || computer.connectedUser.has(sessionId)) return;
      computer.connectedUser.add(sessionId);
    } else {
      computer?.connectedUser.delete(sessionId);
    }
  }
}
