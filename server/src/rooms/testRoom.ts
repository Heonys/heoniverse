import { Room, Client } from "colyseus";
import { MyRoomState, Player } from "./schema/TestRoomState";
import { MessageType } from "../types";

export class MyRoom extends Room<MyRoomState> {
  state = new MyRoomState();

  onCreate(options: any) {
    this.onMessage(MessageType.UPDATE_PLAYER, (client, message) => {
      console.log("player update", message);
    });
  }

  onJoin(client: Client, options: any) {
    this.state.players.set(client.sessionId, new Player());
    client.send(MessageType.SEND_ROOM_DATA, { roomId: this.roomId });
  }

  onLeave(client: Client, consented: boolean) {
    if (this.state.players.has(client.sessionId)) {
      this.state.players.delete(client.sessionId);
    }
  }

  onDispose() {
    console.log("🧹 Room disposed.");
  }
}
