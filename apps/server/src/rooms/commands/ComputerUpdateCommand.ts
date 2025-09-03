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

    if (!computer) return;
    if (connect) {
      computer.connectedUser.add(sessionId);
    } else {
      if (computer.connectedUser.has(sessionId)) {
        computer.connectedUser.delete(sessionId);
      }
    }
  }
}
