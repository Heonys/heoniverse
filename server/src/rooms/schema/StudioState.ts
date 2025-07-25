import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";
import { IPlayer, IStudioState, IChatMessage } from "../../types";

export class Player extends Schema implements IPlayer {
  @type("string") name = "";
  @type("number") x = 705;
  @type("number") y = 500;
  @type("string") animKey = "adam_idle_down";
  @type("boolean") readyToConnect = false;
}

export class ChatMessage extends Schema implements IChatMessage {
  @type("string") author = "";
  @type("number") createdAt = new Date().getTime();
  @type("string") content = "";
}

export class StudioState extends Schema implements IStudioState {
  @type({ map: Player })
  players = new MapSchema<Player>();

  @type([ChatMessage])
  messages = new ArraySchema<ChatMessage>();
}
