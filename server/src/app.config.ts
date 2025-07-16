import express from "express";
import config from "@colyseus/tools";
import { RoomData, RoomType } from "./types";
import { Studio } from "./rooms/Studio";
import cors from "cors";

export default config({
  initializeGameServer: (gameServer) => {
    gameServer.define(RoomType.STUDIO, Studio, {
      name: "Public Room",
      description: "모든 사용자가 자유롭게 입장하여 소통할 수 있는 공개 공간입니다.",
    } satisfies RoomData);
  },

  initializeExpress: (app) => {
    app.use(express.json());
    app.use(cors());
  },

  beforeListen: () => {},
});
