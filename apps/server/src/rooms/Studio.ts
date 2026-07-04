import { Room, Client, ServerError } from "colyseus";
import bcrypt from "bcrypt";
import { Dispatcher } from "@colyseus/command";
import { StudioState, Player, Computer, Whiteboard } from "./schema/StudioSchema";
import {
  Messages,
  IRoom,
  Status,
  PLAYER_NAME_MAX,
  CHAT_MESSAGE_MAX,
  ANIM_KEY_MAX,
  ITEM_ID_PATTERN,
  ITEM_MAP_MAX,
  WHITEBOARD_ELEMENTS_MAX,
  WORLD_BOUNDS,
} from "@heoniverse/shared";
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
    // 클라이언트가 넘기는 autoDispose를 신뢰하면 빈 방을 무한히 유지시킬 수 있다
    this.autoDispose = true;

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
        if (!payload || !Number.isFinite(payload.x) || !Number.isFinite(payload.y)) return;
        if (typeof payload.animKey !== "string" || payload.animKey.length > ANIM_KEY_MAX) return;
        this.dispatcher.dispatch(new PlayerUpdateCommand(), {
          sessionId: client.sessionId,
          x: clamp(payload.x, WORLD_BOUNDS.minX, WORLD_BOUNDS.maxX),
          y: clamp(payload.y, WORLD_BOUNDS.minY, WORLD_BOUNDS.maxY),
          animKey: payload.animKey,
        });
      },
    );

    this.onMessage(Messages.UPDATE_PLAYER_NAME, (client, payload: string) => {
      if (typeof payload !== "string") return;
      const name = payload.trim().slice(0, PLAYER_NAME_MAX);
      if (!name) return;
      this.dispatcher.dispatch(new PlayerNameUpdateCommand(), {
        sessionId: client.sessionId,
        name,
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

    this.onMessage(Messages.UPDATE_MEDIA_ENABLED, (client, payload) => {
      const player = this.state.players.get(client.sessionId);
      if (!player) return;
      player.videoEnabled = payload.video ?? player.videoEnabled;
      player.micEnabled = payload.microphone ?? player.micEnabled;
    });

    this.onMessage(Messages.CREATE_COMPUTER, (client, payload) => {
      if (!isValidItemId(payload) || this.state.computers.size >= ITEM_MAP_MAX) return;
      if (!this.state.computers.has(payload)) {
        this.state.computers.set(payload, new Computer());
      }
    });

    this.onMessage(Messages.CREATE_WHITEBOARD, (client, payload) => {
      if (!isValidItemId(payload) || this.state.whiteboards.size >= ITEM_MAP_MAX) return;
      // 가드 없이 매번 새로 만들면 유저가 입장할 때마다 기존 connectedUser가 초기화된다
      if (!this.state.whiteboards.has(payload)) {
        this.state.whiteboards.set(payload, new Whiteboard());
      }
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
      if (!payload || typeof payload.shared !== "boolean") return;
      const computer = this.state.computers.get(payload.computerId);
      if (!computer) return;

      // payload.userId를 그대로 쓰면 다른 유저를 공유자로 스푸핑할 수 있다
      if (payload.shared) {
        computer.sharingUserId = client.sessionId;
        computer.isSharing = true;
      } else if (computer.sharingUserId === client.sessionId) {
        computer.sharingUserId = "";
        computer.isSharing = false;
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

    this.onMessage(Messages.UPDATE_ELEMENTS, (client, payload: any[]) => {
      if (!Array.isArray(payload) || payload.length > WHITEBOARD_ELEMENTS_MAX) return;
      this.broadcast(Messages.UPDATED_ELEMENTS, payload, { except: client });
    });

    this.onMessage(Messages.PUSH_CHAT_MESSAGE, (client, payload: string) => {
      if (typeof payload !== "string") return;
      const message = payload.slice(0, CHAT_MESSAGE_MAX);
      if (!message.trim()) return;

      this.dispatcher.dispatch(new PushChatUpdateCommand(), {
        sessionId: client.sessionId,
        message,
      });

      this.broadcast(
        Messages.UPDATED_CHAT_MESSAGE,
        { sessionId: client.sessionId, message },
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
      if (typeof options?.password !== "string") {
        throw new ServerError(401, "비밀번호가 올바르지 않습니다.");
      }
      const isMatch = await bcrypt.compare(options.password, this.password);
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

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function isValidItemId(payload: unknown): payload is string {
  return typeof payload === "string" && ITEM_ID_PATTERN.test(payload);
}
