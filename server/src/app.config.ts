import express from "express";
import config from "@colyseus/tools";
import { RoomData, RoomType } from "./types";
import { MyRoom } from "./rooms/testRoom";

export default config({
  initializeGameServer: (gameServer) => {
    gameServer.define(RoomType.TEST_ROOM, MyRoom, {
      name: "Public Room",
      description: "모든 사용자가 자유롭게 입장하여 소통할 수 있는 공개 공간입니다.",
    } satisfies RoomData);
  },

  initializeExpress: (app) => {
    app.use(express.json());
  },

  beforeListen: () => {},
});
