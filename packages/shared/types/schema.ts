import { MapSchema } from "@colyseus/schema";

export enum RoomType {
  LOBBY = "LOBBY",
  PUBLIC = "PUBLIC",
  CUSTOM = "CUSTOM",
}

export interface RoomMetadata {
  name: string;
  description: string;
  hasPassword: boolean;
}

export interface RoomData {
  id: string;
  name: string;
  description: string;
  roomType: RoomType;
  clients: number;
}

export interface IRoom {
  name: string;
  description: string;
  autoDispose: boolean;
  password?: string;
}

export interface IPlayer {
  name: string;
  x: number;
  y: number;
  animKey: string;
  readyToConnect: boolean;
  mediaConnect: boolean;
  videoEnabled: boolean;
  micEnabled: boolean;
  status: Status;
}

export interface IStudioState {
  players: MapSchema<IPlayer>;
}

export type ChatType = "JOINED" | "LEFT" | "CHAT";
export type IChatMessage = {
  clientId: string;
  author: string;
  createdAt: number;
  content: string;
};

export type Status = "available" | "busy" | "focused";
