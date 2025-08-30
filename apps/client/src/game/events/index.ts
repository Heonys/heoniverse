import Phaser from "phaser";
import { IPlayer, MessagePayloadMap, Status } from "@heoniverse/shared";

type EventsPayloadMap = {
  UPDATE_PLAYER_NAME: string;
  UPDATE_PLAYER_STATUS: Status;
  RENDER_TO_STATUS: { id: string; status: Status };
  UPDATE_PLAYER_TEXTURE: MessagePayloadMap["UPDATE_PLAYER"];
  OTHER_PLAYER_JOINED: { sessionId: string; player: IPlayer };
  OTHER_PLAYER_UPDATED: { sessionId: string; player: IPlayer };
  OTHER_PLAYER_LEFT: { sessionId: string; player: IPlayer };
  UPDATED_CHAT_MESSAGE: { sessionId: string; message: string };
  CLOSE_PEER_CALL: string;
  DISCONNECT_PEER_CALL: string;
  MEDIA_ENABLED_CHANGE: boolean;
  MIC_ENABLED_CHANGE: boolean;
  VIDEO_ENABLED_CHANGE: boolean;
  CALL_RESPONSE: "answer" | "reject";
  COMPUTER_USER_ADDED: { userId: string; computerId: string };
  COMPUTER_USER_REMOVED: { userId: string; computerId: string };
  WHITEBOARD_USER_ADDED: { userId: string; whiteboardId: string };
  WHITEBOARD_USER_REMOVED: { userId: string; whiteboardId: string };
};

class PhaserEventEmitter<EventsMap> {
  private ee: Phaser.Events.EventEmitter;

  constructor() {
    this.ee = new Phaser.Events.EventEmitter();
  }

  on<K extends keyof EventsMap & string>(name: K, fn: (payload: EventsMap[K]) => void) {
    this.ee.on(name, fn);
  }

  once<K extends keyof EventsMap & string>(name: K, fn: (payload: EventsMap[K]) => void) {
    this.ee.once(name, fn);
  }

  off<K extends keyof EventsMap & string>(name: K, fn: (payload: EventsMap[K]) => void) {
    this.ee.off(name, fn);
  }

  emit<K extends keyof EventsMap & string>(name: K, payload?: EventsMap[K]) {
    this.ee.emit(name, payload);
  }
}

export const eventEmitter = new PhaserEventEmitter<EventsPayloadMap>();
