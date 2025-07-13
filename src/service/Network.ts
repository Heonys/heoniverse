import { Client, Room } from "colyseus.js";
import { RoomType } from "@server/src/types";

export class Network {
  client: Client;
  room: Room | null = null;

  constructor() {
    this.client = new Client(import.meta.env.VITE_SERVER_URL);
  }

  async joinLobbyRoom() {
    this.room = await this.client.joinOrCreate(RoomType.LOBBY);
  }

  async joinTestRoom() {
    this.room = await this.client.joinOrCreate(RoomType.TEST_ROOM);
  }

  sendMessage(type: string, message: any) {
    if (!this.room) {
      throw new Error("방에 입장하지 않았습니다.");
    }
    this.room.send(type, message);
  }

  onMessage(type: string, callback: (message: any) => void) {
    if (!this.room) {
      throw new Error("방에 입장하지 않았습니다.");
    }
    this.room.onMessage(type, callback);
  }
}
