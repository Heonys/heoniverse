import { Room, Client } from "colyseus";
import { MyRoomState, Player } from "./schema/TestRoomState";
import { MessageType, RoomData } from "../types";

export class MyRoom extends Room<MyRoomState> {
  state = new MyRoomState();
  name!: string;
  description!: string;

  onCreate(options: RoomData) {
    this.name = options.name;
    this.description = options.description;

    this.onMessage(MessageType.UPDATE_PLAYER, (client, message) => {
      console.log("player update", message);
    });
  }

  onJoin(client: Client, options: any) {
    this.state.players.set(client.sessionId, new Player());
    client.send(MessageType.SEND_ROOM_DATA, {
      id: this.roomId,
      name: this.name,
      description: this.description,
    });
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
