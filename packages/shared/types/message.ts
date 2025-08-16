import { IPlayer, RoomData, Status } from "./schema";

export enum Messages {
  SEND_ROOM_DATA = "SEND_ROOM_DATA",
  SEND_TOTAL_CLIENTS = "SEND_TOTAL_CLIENTS",
  UPDATE_PLAYER = "UPDATE_PLAYER",
  UPDATE_PLAYER_NAME = "UPDATE_PLAYER_NAME",
  UPDATE_PLAYER_STATUS = "UPDATE_PLAYER_STATUS",
  READY_TO_CONNECT = "READY_TO_CONNECT",
  PUSH_CHAT_MESSAGE = "PUSH_CHAT_MESSAGE",
  UPDATED_CHAT_MESSAGE = "UPDATED_CHAT_MESSAGE",
}

export type MessagePayloadMap = {
  SEND_ROOM_DATA: RoomData;
  SEND_TOTAL_CLIENTS: { totalClients: number };
  UPDATE_PLAYER_STATUS: Status;
  UPDATE_PLAYER: Omit<IPlayer, "name" | "readyToConnect" | "status">;
  UPDATE_PLAYER_NAME: string;
  READY_TO_CONNECT: void;
  PUSH_CHAT_MESSAGE: string;
  UPDATED_CHAT_MESSAGE: { sessionId: string; message: string };
};
