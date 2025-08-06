import { Client, Room, getStateCallbacks } from "colyseus.js";
import { RoomType, Messages, MessagePayloadMap, IRoom } from "@heoniverse/shared";
import { StudioState } from "@server/rooms/schema/StudioSchema";
import { store } from "@/stores";
import {
  setJoinedRoomData,
  setLobbyJoined,
  setAvailableRoom,
  addAvailableRoom,
  removeAvailableRoom,
} from "@/stores/roomSlice";
import { eventEmitter } from "@/game/events";
import { pushMessage } from "@/stores/chatSlice";

export class Network {
  client: Client;
  room: Room<StudioState> | null = null;
  lobby: Room | null = null;
  sessionId!: string;

  constructor() {
    this.client = new Client(import.meta.env.VITE_WEBSOCKET_URL);

    this.joinLobbyRoom().then(() => {
      store.dispatch(setLobbyJoined(true));
    });
    this.registerEventHandler();
  }

  registerEventHandler() {
    eventEmitter.on("UPDATE_PLAYER_NAME", (payload) => {
      this.sendMessage("UPDATE_PLAYER_NAME", payload);
    });

    eventEmitter.on("UPDATE_PLAYER_TEXTURE", (payload) => {
      this.sendMessage("UPDATE_PLAYER", payload);
    });
  }

  async joinLobbyRoom() {
    this.lobby = await this.client.joinOrCreate(RoomType.LOBBY);

    this.lobby.onMessage("rooms", (rooms) => {
      store.dispatch(setAvailableRoom(rooms));
    });

    this.lobby.onMessage("+", ([_roomId, room]) => {
      store.dispatch(addAvailableRoom(room));
    });

    this.lobby.onMessage("-", (roomId) => {
      store.dispatch(removeAvailableRoom(roomId));
    });
  }

  async joinPublicRoom() {
    this.room = await this.client.joinOrCreate(RoomType.PUBLIC);
    this.setupRoom();
  }

  async joinCustomRoom(roomId: string, password?: string) {
    this.room = await this.client.joinById(roomId, { password });
    this.setupRoom();
  }

  async createCustomRoom(room: IRoom) {
    this.room = await this.client.create(RoomType.CUSTOM, room);
    this.setupRoom();
  }

  async leaveCurrentRoom() {
    if (!this.room) return;

    await this.room.leave();
    this.room.removeAllListeners();
    this.room = null;
  }

  sendMessage<T extends keyof MessagePayloadMap>(type: T, message?: MessagePayloadMap[T]) {
    if (!this.room) {
      throw new Error("방에 입장하지 않았습니다.");
    }
    this.room.send(type, message);
  }

  onMessage<T extends keyof MessagePayloadMap>(
    type: T,
    callback: (message: MessagePayloadMap[T]) => void,
  ) {
    if (!this.room) {
      throw new Error("방에 입장하지 않았습니다.");
    }
    this.room.onMessage(type, callback);
  }

  readyToConnect() {
    this.sendMessage("READY_TO_CONNECT");
  }

  setupRoom() {
    if (!this.room) return;
    this.lobby?.leave();
    store.dispatch(setLobbyJoined(false));

    this.sessionId = this.room.sessionId;
    const $ = getStateCallbacks(this.room);

    $(this.room.state).players.onAdd((player, sessionId) => {
      if (this.sessionId === sessionId) return;

      $(player).onChange(() => {
        eventEmitter.emit("OTHER_PLAYER_UPDATED", { sessionId, player });
      });

      $(player).listen("name", (name) => {
        if (name) {
          eventEmitter.emit("OTHER_PLAYER_JOINED", { sessionId, player });
        }
      });
    });

    $(this.room.state).players.onRemove((player, sessionId) => {
      eventEmitter.emit("OTHER_PLAYER_LEFT", { sessionId, player });
    });

    $(this.room.state).messages.onAdd((message) => {
      store.dispatch(pushMessage(message));
    });

    this.onMessage(Messages.SEND_ROOM_DATA, (data) => {
      store.dispatch(setJoinedRoomData(data));
    });

    this.onMessage(Messages.UPDATED_CHAT_MESSAGE, (payload) => {
      eventEmitter.emit("UPDATED_CHAT_MESSAGE", payload);
    });
  }
}
