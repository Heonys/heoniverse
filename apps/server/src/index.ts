import "dotenv/config";
import { listen } from "@colyseus/tools";
import app from "./app.config";

const GAME_SERVER_PORT = Number(process.env.GAME_SERVER_PORT ?? 2567);
listen(app, GAME_SERVER_PORT);
