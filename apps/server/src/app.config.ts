import { monitor } from "@colyseus/monitor";
import config from "@colyseus/tools";
import { uWebSocketsTransport } from "@colyseus/uwebsockets-transport";
import express from "express";
import type { RequestHandler } from "express";
import { RoomType } from "@heoniverse/shared";

import { Studio } from "./rooms/Studio";
import { CustomLobbyRoom } from "./rooms/Lobby";
import cors from "cors";

// 모니터 대시보드 보호: MONITOR_PASSWORD가 있으면 basic-auth,
// 없으면 프로덕션에선 차단하고 로컬 개발에선 그대로 허용한다
const monitorAuth: RequestHandler = (req, res, next) => {
  const password = process.env.MONITOR_PASSWORD;
  if (!password) {
    if (process.env.NODE_ENV === "production") {
      res.status(404).end();
      return;
    }
    next();
    return;
  }

  const header = req.headers.authorization ?? "";
  const [scheme, encoded] = header.split(" ");
  if (scheme === "Basic" && encoded) {
    const [, pass] = Buffer.from(encoded, "base64").toString().split(":");
    if (pass === password) {
      next();
      return;
    }
  }
  res.set("WWW-Authenticate", 'Basic realm="colyseus-monitor"').status(401).end();
};

export default config({
  initializeTransport: function () {
    return new uWebSocketsTransport({
      maxPayloadLength: 2 * 1024 * 1024,
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
    app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") ?? true }));
    // Render 헬스체크 및 잠든 서버 깨우기 핑 용도 (모니터 인증과 무관한 공개 경로)
    app.get("/health", (_req, res) => {
      res.status(200).send("ok");
    });
    app.use("/colyseus", monitorAuth, monitor());
  },

  beforeListen: () => {},
});
