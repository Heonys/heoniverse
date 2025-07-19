import { Room, Client } from "colyseus";
import { Dispatcher } from "@colyseus/command";
import { StudioState, Player } from "./schema/StudioState";
import { Messages, RoomData } from "../types";
import { PlayerUpdateCommand, PlayerNameUpdateCommand, PushChatUpdateCommand } from "./commands";

export class Studio extends Room<StudioState> {
  state = new StudioState();
  dispatcher = new Dispatcher(this);
  name!: string;
  description!: string;

  onCreate(options: RoomData) {
    this.name = options.name;
    this.description = options.description;

    this.onMessage(
      Messages.UPDATE_PLAYER,
      (client, payload: { x: number; y: number; animKey: string }) => {
        this.dispatcher.dispatch(new PlayerUpdateCommand(), {
          sessionId: client.sessionId,
          x: payload.x,
          y: payload.y,
          animKey: payload.animKey,
        });
      },
    );

    this.onMessage(Messages.UPDATE_PLAYER_NAME, (client, payload: string) => {
      this.dispatcher.dispatch(new PlayerNameUpdateCommand(), {
        sessionId: client.sessionId,
        name: payload,
      });
    });

    this.onMessage(Messages.READY_TO_CONNECT, (client) => {
      const player = this.state.players.get(client.sessionId);
      if (!player) return;
      player.readyToConnect = true;
    });

    this.onMessage(Messages.PUSH_CHAT_MESSAGE, (client, payload: string) => {
      this.dispatcher.dispatch(new PushChatUpdateCommand(), {
        sessionId: client.sessionId,
        message: payload,
      });

      this.broadcast(
        Messages.UPDATED_CHAT_MESSAGE,
        { clientId: client.sessionId, message: payload },
        { except: client },
      );
    });
  }

  onJoin(client: Client, options: any) {
    this.state.players.set(client.sessionId, new Player());
    client.send(Messages.SEND_ROOM_DATA, {
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
