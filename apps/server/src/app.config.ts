import { monitor } from "@colyseus/monitor";
import config from "@colyseus/tools";
import { uWebSocketsTransport } from "@colyseus/uwebsockets-transport";
import express from "express";
import { RoomType } from "../../../packages/shared";

import { Studio } from "./rooms/Studio";
import { CustomLobbyRoom } from "./rooms/Robby";
import cors from "cors";

export default config({
  initializeTransport: function () {
    return new uWebSocketsTransport({
      maxPayloadLength: 16 * 1024 * 1024,
    });
  },

  initializeGameServer: (gameServer) => {
    gameServer.define(RoomType.LOBBY, CustomLobbyRoom);
    gameServer.define(RoomType.PUBLIC, Studio, {
      name: "Public Room",
      description: "모든 사용자가 자유롭게 입장하여 소통할 수 있는 공개 공간입니다.",
      autoDispose: true,
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
