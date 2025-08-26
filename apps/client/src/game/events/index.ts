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
};

class PhaserEventEmitter<EventsMap> {
  private ee: Phaser.Events.EventEmitter;

  constructor() {
    this.ee = new Phaser.Events.EventEmitter();
  }

  on<K extends keyof EventsMap & string>(name: K, fn: (payload: EventsMap[K]) => void) {
    this.ee.on(name, fn);
  }

  off<K extends keyof EventsMap & string>(name: K, fn: (payload: EventsMap[K]) => void) {
    this.ee.off(name, fn);
  }

  emit<K extends keyof EventsMap & string>(name: K, payload?: EventsMap[K]) {
    this.ee.emit(name, payload);
  }
}

export const eventEmitter = new PhaserEventEmitter<EventsPayloadMap>();
