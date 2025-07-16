import { Schema, type, MapSchema } from "@colyseus/schema";
import { IPlayer, IStudioState } from "../../types";

export class Player extends Schema implements IPlayer {
  @type("string") name = "";
  @type("number") x = 705;
  @type("number") y = 500;
  @type("string") animKey = "adam_idle_down";
}

export class StudioState extends Schema implements IStudioState {
  @type({ map: Player }) players = new MapSchema<Player>();
}
