import { monitor } from "@colyseus/monitor";
import config from "@colyseus/tools";
import express from "express";
import { RoomType } from "@heoniverse/shared";
import { Studio } from "./rooms/Studio";
import { CustomLobbyRoom } from "./rooms/Robby";
import cors from "cors";

export default config({
  initializeGameServer: (gameServer) => {
    gameServer.define(RoomType.LOBBY, CustomLobbyRoom);
    gameServer.define(RoomType.PUBLIC, Studio, {
      name: "Public Room",
      description: "모든 사용자가 자유롭게 입장하여 소통할 수 있는 공개 공간입니다.",
      autoDispose: false,
    });
    gameServer.define(RoomType.CUSTOM, Studio).enableRealtimeListing();
  },

  initializeExpress: (app) => {
    app.use(express.json());
    app.use(cors());
    app.use("/colyseus", monitor());
  },

  beforeListen: () => {},
});
