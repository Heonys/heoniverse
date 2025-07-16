import { MapSchema } from "@colyseus/schema";

export enum RoomType {
  LOBBY = "LOBBY",
  STUDIO = "STUDIO",
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

export interface IPlayer {
  name: string;
  x: number;
  y: number;
  animKey: string;
}

export interface IStudioState {
  players: MapSchema<IPlayer>;
}
