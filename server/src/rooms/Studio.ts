import { Room, Client } from "colyseus";
import { Dispatcher } from "@colyseus/command";
import { StudioState, Player } from "./schema/StudioState";
import { MessageType, RoomData } from "../types";
import { PlayerUpdateCommand, PlayerNameUpdateCommand } from "./commands";

export class Studio extends Room<StudioState> {
  state = new StudioState();
  dispatcher = new Dispatcher(this);
  name!: string;
  description!: string;

  onCreate(options: RoomData) {
    this.name = options.name;
    this.description = options.description;

    this.onMessage(
      MessageType.UPDATE_PLAYER,
      (client, payload: { x: number; y: number; animKey: string }) => {
        this.dispatcher.dispatch(new PlayerUpdateCommand(), {
          sessionId: client.sessionId,
          x: payload.x,
          y: payload.y,
          animKey: payload.animKey,
        });
      },
    );

    this.onMessage(MessageType.UPDATE_PLAYER_NAME, (client, payload: string) => {
      this.dispatcher.dispatch(new PlayerNameUpdateCommand(), {
        sessionId: client.sessionId,
        name: payload,
      });
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
    // console.log("🧹 Room disposed.");
  }
}
