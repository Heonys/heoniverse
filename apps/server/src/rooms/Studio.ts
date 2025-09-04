import { Room, Client, ServerError } from "colyseus";
import bcrypt from "bcrypt";
import { Dispatcher } from "@colyseus/command";
import { StudioState, Player, Computer, Whiteboard } from "./schema/StudioSchema";
import { Messages, IRoom, Status } from "@heoniverse/shared";
import {
  PlayerUpdateCommand,
  PlayerNameUpdateCommand,
  PushChatUpdateCommand,
  PlayerUpdateStatus,
  ComputerUpdateCommand,
  WhiteboardUpdateCommand,
} from "./commands";

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

    this.onMessage(Messages.UPDATE_PLAYER_STATUS, (client, payload: Status) => {
      this.dispatcher.dispatch(new PlayerUpdateStatus(), {
        sessionId: client.sessionId,
        status: payload,
      });
    });

    this.onMessage(Messages.READY_TO_CONNECT, (client) => {
      const player = this.state.players.get(client.sessionId);
      if (!player) return;
      player.readyToConnect = true;
    });

    this.onMessage(Messages.UPDATE_MEDIA_CONNECT, (client, payload) => {
      const player = this.state.players.get(client.sessionId);
      if (!player) return;
      player.mediaConnect = payload;
    });

    this.onMessage(Messages.UPDATE_MEDIA_ENABELD, (client, payload) => {
      const player = this.state.players.get(client.sessionId);
      if (!player) return;
      player.videoEnabled = payload.video ?? player.videoEnabled;
      player.micEnabled = payload.microphone ?? player.micEnabled;
    });

    this.onMessage(Messages.CREATE_COMPUTER, (client, payload) => {
      if (!this.state.computers.has(payload)) {
        this.state.computers.set(payload, new Computer());
      }
    });

    this.onMessage(Messages.CREATE_WHITEBOARD, (client, payload) => {
      this.state.whiteboards.set(payload, new Whiteboard());
    });

    this.onMessage(Messages.CONNECT_COMPUTER, (client, payload) => {
      this.dispatcher.dispatch(new ComputerUpdateCommand(), {
        sessionId: client.sessionId,
        computerId: payload.id,
        connect: payload.connect,
      });
    });

    this.onMessage(Messages.CONNECT_WHITEBOARD, (client, payload) => {
      this.dispatcher.dispatch(new WhiteboardUpdateCommand(), {
        sessionId: client.sessionId,
        whiteboardId: payload.id,
        connect: payload.connect,
      });
    });

    this.onMessage(Messages.UPDATED_CALLING, (client, payload) => {
      const player = this.state.players.get(client.sessionId);
      if (!player) return;
      player.isCalling = payload;
    });

    this.onMessage(Messages.SEND_REJECTED_CALL, (client, peerId) => {
      const caller = this.clients.find((c) => c.sessionId === peerId);
      if (caller) {
        caller.send(Messages.SEND_REJECTED_CALL, client.sessionId);
      }
    });

    this.onMessage(Messages.SEND_ANSWER_CALL, (client, peerId) => {
      const caller = this.clients.find((c) => c.sessionId === peerId);
      if (caller) {
        caller.send(Messages.SEND_ANSWER_CALL, client.sessionId);
      }
    });

    this.onMessage(Messages.SCREEN_SHARING, (client, payload) => {
      const computer = this.state.computers.get(payload.computerId);
      if (computer) {
        computer.sharingUserId = payload.userId;
        computer.isSharing = payload.shared;
      }
    });

    this.onMessage(Messages.SCREEN_SHARING_REQUEST, (client, payload) => {
      const { computerId, sharingId } = payload;
      const computer = this.state.computers.get(computerId);
      const sharer = this.clients.find((c) => c.sessionId === sharingId);

      if (computer && sharer) {
        if (computer.sharingUserId === sharingId && computer.isSharing) {
          sharer.send(Messages.SCREEN_SHARING_RESPONSE, client.sessionId);
        }
      }
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
    const clientId = client.sessionId;
    if (this.state.players.has(clientId)) {
      this.state.players.delete(clientId);
    }
    this.state.computers.forEach((computer) => {
      if (computer.connectedUser.has(clientId)) {
        computer.connectedUser.delete(clientId);
      }
      if (computer.sharingUserId === clientId) {
        computer.sharingUserId = "";
        computer.isSharing = false;
      }
    });
    this.state.whiteboards.forEach((whiteboard) => {
      if (whiteboard.connectedUser.has(clientId)) {
        whiteboard.connectedUser.delete(clientId);
      }
    });
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
