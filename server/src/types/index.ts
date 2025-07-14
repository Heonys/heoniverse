export enum RoomType {
  LOBBY = "LOBBY",
  TEST_ROOM = "TEST_ROOM",
}

export enum MessageType {
  SEND_ROOM_DATA = "SEND_ROOM_DATA",
  UPDATE_PLAYER = "UPDATE_PLAYER",
}

export interface RoomData {
  name: string;
  description: string;
  password?: number;
}
