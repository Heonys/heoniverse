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
  CONNECT_COMPUTER = "CONNECT_COMPUTER",
  CONNECT_WHITEBOARD = "CONNECT_WHITEBOARD",
  CREATE_COMPUTER = "CREATE_COMPUTER",
  CREATE_WHITEBOARD = "CREATE_WHITEBOARD",
  SCREEN_SHARING = "SCREEN_SHARING",
  SCREEN_SHARING_REQUEST = "SCREEN_SHARING_REQUEST",
  SCREEN_SHARING_RESPONSE = "SCREEN_SHARING_RESPONSE",
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
  CONNECT_COMPUTER: { id: string; connect: boolean };
  CONNECT_WHITEBOARD: { id: string; connect: boolean };
  CREATE_COMPUTER: string;
  CREATE_WHITEBOARD: string;
  SCREEN_SHARING: { computerId: string; userId: string; shared: boolean };
  SCREEN_SHARING_REQUEST: { computerId: string; sharingId: string };
  SCREEN_SHARING_RESPONSE: string;
};
