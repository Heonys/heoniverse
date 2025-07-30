import { MapSchema } from "@colyseus/schema";

export enum RoomType {
  LOBBY = "LOBBY",
  STUDIO = "STUDIO",
}

export interface RoomData {
  id: string;
  name: string;
  description: string;
}

export interface IPlayer {
  name: string;
  x: number;
  y: number;
  animKey: string;
  readyToConnect: boolean;
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
