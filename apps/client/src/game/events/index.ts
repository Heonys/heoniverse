import Phaser from "phaser";
import { IPlayer, MessagePayloadMap, Status } from "@heoniverse/shared";

type EventsPayloadMap = {
  UPDATE_PLAYER_NAME: string;
  UPDATE_PLAYER_STATUS: Status;
  RENDER_TO_STATUS: { id: string; status: Status };
  PROXIMITY_VOLUME_CHANGED: { id: string; volume: number };
  UPDATE_PLAYER_TEXTURE: MessagePayloadMap["UPDATE_PLAYER"];
  OTHER_PLAYER_JOINED: { sessionId: string; player: IPlayer };
  OTHER_PLAYER_UPDATED: { sessionId: string; player: IPlayer };
  OTHER_PLAYER_LEFT: { sessionId: string; player: IPlayer };
  UPDATED_CHAT_MESSAGE: { sessionId: string; message: string };
  UPDATED_EMOTE: { sessionId: string; emote: string };
  // AI NPC 대화 잠금 상태 변화(누가 점유 중인지)와 NPC의 답풍선(방 전체로 브로드캐스트됨)
  NPC_TALKING_CHANGED: { sessionId: string };
  NPC_SAID: { message: string };
  // 대화 중인 유저의 말 — 다른 사람 화면에서 그 유저 말풍선으로 표시
  NPC_USER_SAID: { sessionId: string; message: string };
  CLOSE_PEER_CALL: string;
  DISCONNECT_PEER_CALL: string;
  MEDIA_ENABLED_CHANGE: boolean;
  MIC_ENABLED_CHANGE: boolean;
  VIDEO_ENABLED_CHANGE: boolean;
  MEDIA_STREAMS_CHANGED: void;
  CALL_RESPONSE: "answer" | "reject";
  COMPUTER_USER_ADDED: { userId: string; computerId: string };
  COMPUTER_USER_REMOVED: { userId: string; computerId: string };
  WHITEBOARD_USER_ADDED: { userId: string; whiteboardId: string };
  WHITEBOARD_USER_REMOVED: { userId: string; whiteboardId: string };
  UPDATED_ELEMENTS: readonly any[];
  JOYSTICK_KEY_PRESSED: "keyE" | "keyR" | "keySpace";
  TOGGLE_EMOTE_WHEEL: void;
  SCREENSHOT_TAKEN: void;
  // 공유 물리 공의 서버 상태 변화(위치·주인) — Game 씬이 받아 공 스프라이트에 반영
  BALL_CHANGED: { x: number; y: number; ownerId: string };
  // 다른 유저가 나를 콕 찌름 — NudgeToast가 받아 인앱 토스트/데스크탑 알림으로 분기
  NUDGED: { sessionId: string; name: string };
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
