import { MapSchema } from "@colyseus/schema";

export enum RoomType {
  LOBBY = "LOBBY",
  STUDIO = "STUDIO",
}

export enum MessageType {
  SEND_ROOM_DATA = "SEND_ROOM_DATA",
  UPDATE_PLAYER = "UPDATE_PLAYER",
  UPDATE_PLAYER_NAME = "UPDATE_PLAYER_NAME",
}

export type MessagePayloadMap = {
  SEND_ROOM_DATA: RoomData;
  UPDATE_PLAYER: Omit<IPlayer, "name">;
  UPDATE_PLAYER_NAME: string;
};

export interface RoomData {
  name: string;
  description: string;
  password?: number;
}

export interface IPlayer {
  name: string;
  x: number;
  y: number;
  animKey: string;
}

export interface IStudioState {
  players: MapSchema<IPlayer>;
}
