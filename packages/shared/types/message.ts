import { IPlayer, RoomData, Status } from "./schema";

export enum Messages {
  SEND_ROOM_DATA = "SEND_ROOM_DATA",
  SEND_TOTAL_CLIENTS = "SEND_TOTAL_CLIENTS",
  UPDATE_PLAYER = "UPDATE_PLAYER",
  UPDATE_PLAYER_NAME = "UPDATE_PLAYER_NAME",
  UPDATE_PLAYER_STATUS = "UPDATE_PLAYER_STATUS",
  READY_TO_CONNECT = "READY_TO_CONNECT",
  UPDATE_MEDIA_CONNECT = "UPDATE_MEDIA_CONNECT",
  UPDATE_MEDIA_ENABELD = "UPDATE_MEDIA_ENABELD",
  PUSH_CHAT_MESSAGE = "PUSH_CHAT_MESSAGE",
  UPDATED_CHAT_MESSAGE = "UPDATED_CHAT_MESSAGE",
  UPDATED_CALLING = "UPDATED_CALLING",
  SEND_REJECTED_CALL = "SEND_REJECTED_CALL",
  SEND_ANSWER_CALL = "SEND_ANSWER_CALL",
}

export type MessagePayloadMap = {
  SEND_ROOM_DATA: RoomData;
  SEND_TOTAL_CLIENTS: { totalClients: number };
  UPDATE_PLAYER_STATUS: Status;
  UPDATE_PLAYER: Omit<
    IPlayer,
    | "name"
    | "readyToConnect"
    | "mediaConnect"
    | "videoEnabled"
    | "micEnabled"
    | "status"
    | "isCalling"
  >;
  UPDATE_PLAYER_NAME: string;
  READY_TO_CONNECT: void;
  UPDATE_MEDIA_CONNECT: boolean;
  UPDATE_MEDIA_ENABELD: { video?: boolean; microphone?: boolean };
  PUSH_CHAT_MESSAGE: string;
  UPDATED_CHAT_MESSAGE: { sessionId: string; message: string };
  UPDATED_CALLING: boolean;
  SEND_REJECTED_CALL: string;
  SEND_ANSWER_CALL: string;
};
