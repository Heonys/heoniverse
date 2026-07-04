import "dotenv/config";
import { listen } from "@colyseus/tools";
import app from "./app.config";

// PORT는 Render 같은 PaaS가 주입하는 값을 우선한다
const GAME_SERVER_PORT = Number(process.env.PORT ?? process.env.GAME_SERVER_PORT ?? 2567);
listen(app, GAME_SERVER_PORT);
