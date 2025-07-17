import { Client, Room, getStateCallbacks } from "colyseus.js";
import { RoomType, Messages, MessagePayloadMap } from "@server/src/types";
import { StudioState } from "@server/src/rooms/schema/StudioState";
import { store } from "@/stores";
import {
  setJoinedRoomData,
  setLobbyJoined,
  setAvailableRoom,
  addAvailableRoom,
  removeAvailableRoom,
} from "@/stores/roomSlice";
import { eventEmitter } from "@/game/events";

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

    this.lobby.onMessage("-", ([roomId]) => {
      store.dispatch(removeAvailableRoom(roomId));
    });
  }

  async joinPublicRoom() {
    this.room = await this.client.joinOrCreate(RoomType.STUDIO);
    this.setupRoom();
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
    this.sessionId = this.room.sessionId;
    const $ = getStateCallbacks(this.room);

    $(this.room.state).players.onAdd((player, sessionId) => {
      if (this.sessionId === sessionId) return;

      $(player).onChange(() => {
        eventEmitter.emit("OTHER_PLAYER_UPDATED", { sessionId, player });
      });

      $(player).listen("name", () => {
        eventEmitter.emit("OTHER_PLAYER_JOINED", { sessionId, player });
      });
    });

    $(this.room.state).players.onRemove((player, sessionId) => {
      eventEmitter.emit("OTHER_PLAYER_LEFT", sessionId);
    });

    this.room.onMessage(Messages.SEND_ROOM_DATA, (data) => {
      store.dispatch(setJoinedRoomData(data));
    });
  }
}
