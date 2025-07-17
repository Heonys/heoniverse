import { MessagePayloadMap } from "@server/src/types";

type EventsPayloadMap = {
  UPDATE_PLAYER_NAME: string;
  UPDATE_PLAYER_TEXTURE: MessagePayloadMap["UPDATE_PLAYER"];
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
