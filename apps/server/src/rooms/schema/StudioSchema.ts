import { Schema, type, MapSchema, SetSchema, ArraySchema } from "@colyseus/schema";
import { IPlayer, IStudioState, IChatMessage, Status } from "@heoniverse/shared";

export class Player extends Schema implements IPlayer {
  @type("string") name = "";
  @type("number") x = 705;
  @type("number") y = 500;
  @type("string") animKey = "suit_idle_down";
  @type("boolean") readyToConnect = false;
  @type("boolean") mediaConnect = false;
  @type("boolean") videoEnabled = true;
  @type("boolean") micEnabled = true;
  @type("boolean") isCalling = false;
  @type("string") status: Status = "available";
}

export class ChatMessage extends Schema implements IChatMessage {
  @type("string") clientId = "";
  @type("string") author = "";
  @type("number") createdAt = new Date().getTime();
  @type("string") content = "";
}

export class Computer extends Schema {
  @type({ set: "string" }) connectedUser = new SetSchema<string>();
  @type("string") sharingUserId = "";
  @type("boolean") isSharing = false;
}

export class Whiteboard extends Schema {
  @type({ set: "string" }) connectedUser = new SetSchema<string>();
}

export class StudioState extends Schema implements IStudioState {
  @type({ map: Player }) players = new MapSchema<Player>();
  @type({ map: Computer }) computers = new MapSchema<Computer>();
  @type({ map: Whiteboard }) whiteboards = new MapSchema<Whiteboard>();
  @type([ChatMessage]) messages = new ArraySchema<ChatMessage>();
  // 현재 AI NPC와 대화 중인 클라이언트 sessionId ("" = 아무도 대화 안 함). 한 번에 한 명만.
  @type("string") npcTalkingUser = "";
}
