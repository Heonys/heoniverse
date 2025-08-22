import "dotenv/config";
import http from "http";
import express from "express";
import { listen } from "@colyseus/tools";
import { ExpressPeerServer } from "peer";
import app from "./app.config";

const GAME_SERVER_PORT = Number(process.env.GAME_SERVER_PORT ?? 5123);
const PEER_SERVER_PORT = Number(process.env.PEER_SERVER_PORT ?? 5124);

listen(app, GAME_SERVER_PORT);

const peerApp = express();
const peerServerHttp = http.createServer(peerApp);
const peerServer = ExpressPeerServer(peerServerHttp, { path: "/" });
peerApp.use("/peerjs", peerServer);
peerServerHttp.listen(PEER_SERVER_PORT);
