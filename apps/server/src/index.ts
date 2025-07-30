import "dotenv/config";
import { listen } from "@colyseus/tools";
import app from "./app.config";

const PORT = Number(process.env.PORT ?? 5123);
listen(app, PORT);
