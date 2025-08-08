import { Room, Client, AuthContext, ServerError } from "colyseus";
import bcrypt from "bcrypt";
import { Dispatcher } from "@colyseus/command";
import { StudioState, Player } from "./schema/StudioSchema";
import { Messages, IRoom, RoomType } from "@heoniverse/shared";
import { PlayerUpdateCommand, PlayerNameUpdateCommand, PushChatUpdateCommand } from "./commands";

export class Studio extends Room<StudioState> {
  state = new StudioState();
  dispatcher = new Dispatcher(this);
  name!: string;
  description!: string;
  password?: string;

  async onCreate(options: IRoom) {
    this.name = options.name;
    this.description = options.description;
    this.autoDispose = options.autoDispose;

    if (options.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(options.password, salt);
    }

    this.setMetadata({
      name: this.name,
      description: this.description,
      hasPassword: !!this.password,
    });

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
        { sessionId: client.sessionId, message: payload },
        { except: client },
      );
    });
  }

  onJoin(client: Client, options: any) {
    this.state.players.set(client.sessionId, new Player());
    client.send(Messages.SEND_ROOM_DATA, {
      id: this.roomId,
      roomType: this.roomName,
      name: this.name,
      description: this.description,
    });
  }

  onLeave(client: Client, consented: boolean) {
    if (this.state.players.has(client.sessionId)) {
      this.state.players.delete(client.sessionId);
    }
  }

  async onAuth(client: Client, options: IRoom) {
    if (this.password) {
      const isMatch = await bcrypt.compare(options.password!, this.password);
      if (!isMatch) {
        throw new ServerError(401, "비밀번호가 올바르지 않습니다.");
      }
    }
    return true;
  }

  onDispose() {
    this.dispatcher.stop();
  }
}
