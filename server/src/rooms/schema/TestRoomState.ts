import { Schema, type, MapSchema } from "@colyseus/schema";

export class Player extends Schema {
  @type("string") name = "";
  @type("number") x = 705;
  @type("number") y = 500;
  @type("string") animKey = "adam_idle_down";
}

export class MyRoomState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
}
