import { IPlayer, RoomData } from "./schema";

export enum Messages {
  SEND_ROOM_DATA = "SEND_ROOM_DATA",
  UPDATE_PLAYER = "UPDATE_PLAYER",
  UPDATE_PLAYER_NAME = "UPDATE_PLAYER_NAME",
  READY_TO_CONNECT = "READY_TO_CONNECT",
  PUSH_CHAT_MESSAGE = "PUSH_CHAT_MESSAGE",
  UPDATED_CHAT_MESSAGE = "UPDATED_CHAT_MESSAGE",
}

export type MessagePayloadMap = {
  SEND_ROOM_DATA: RoomData;
  UPDATE_PLAYER: Omit<IPlayer, "name" | "readyToConnect">;
  UPDATE_PLAYER_NAME: string;
  READY_TO_CONNECT: void;
  PUSH_CHAT_MESSAGE: string;
  UPDATED_CHAT_MESSAGE: { sessionId: string; message: string };
};
