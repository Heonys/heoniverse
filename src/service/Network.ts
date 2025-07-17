import { Client, Room } from "colyseus.js";
import { RoomType, MessageType, IStudioState, MessagePayloadMap, IPlayer } from "@server/src/types";
import { store } from "@/stores";
import {
  setJoinedRoomData,
  setLobbyJoined,
  setAvailableRoom,
  addAvailableRoom,
  removeAvailableRoom,
} from "@/stores/roomSlice";

export class Network {
  client: Client;
  room: Room<IStudioState> | null = null;
  lobby: Room | null = null;
  sessionId!: string;

  constructor() {
    this.client = new Client(import.meta.env.VITE_SERVER_URL);

    this.joinLobbyRoom().then(() => {
      store.dispatch(setLobbyJoined(true));
    });
  }

  async joinLobbyRoom() {
    this.lobby = await this.client.joinOrCreate(RoomType.LOBBY);

    this.lobby.onMessage("rooms", (rooms) => {
      store.dispatch(setAvailableRoom(rooms));
    });

    this.lobby.onMessage("+", ([_roomId, room]) => {
      store.dispatch(
        addAvailableRoom({
          ...room,
          createdAt: room.createdAt.toISOString(),
        }),
      );
    });

    this.lobby.onMessage("-", ([roomId]) => {
      store.dispatch(removeAvailableRoom(roomId));
    });
  }

  async joinPublicRoom() {
    this.room = await this.client.joinOrCreate(RoomType.STUDIO);
    this.setupRoom();
  }

  sendMessage<T extends keyof MessagePayloadMap>(type: T, message: MessagePayloadMap[T]) {
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

  setupRoom() {
    if (!this.room) return;
    this.sessionId = this.room.sessionId;

    this.room.onMessage(MessageType.SEND_ROOM_DATA, (data) => {
      store.dispatch(setJoinedRoomData(data));
    });
  }
}
