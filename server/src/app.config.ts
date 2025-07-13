import express from "express";
import config from "@colyseus/tools";
import { RoomType } from "./types";
import { MyRoom } from "./rooms/testRoom";

export default config({
  initializeGameServer: (gameServer) => {
    gameServer.define(RoomType.TEST_ROOM, MyRoom);
  },

  initializeExpress: (app) => {
    app.use(express.json());
  },

  beforeListen: () => {},
});
