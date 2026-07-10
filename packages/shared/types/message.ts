import { IPlayer, RoomData, Status } from "./schema";

export enum Messages {
  SEND_ROOM_DATA = "SEND_ROOM_DATA",
  SEND_TOTAL_CLIENTS = "SEND_TOTAL_CLIENTS",
  UPDATE_PLAYER = "UPDATE_PLAYER",
  UPDATE_PLAYER_NAME = "UPDATE_PLAYER_NAME",
  UPDATE_PLAYER_STATUS = "UPDATE_PLAYER_STATUS",
  READY_TO_CONNECT = "READY_TO_CONNECT",
  UPDATE_MEDIA_CONNECT = "UPDATE_MEDIA_CONNECT",
  UPDATE_MEDIA_ENABLED = "UPDATE_MEDIA_ENABLED",
  PUSH_CHAT_MESSAGE = "PUSH_CHAT_MESSAGE",
  UPDATED_CHAT_MESSAGE = "UPDATED_CHAT_MESSAGE",
  UPDATED_CALLING = "UPDATED_CALLING",
  SEND_REJECTED_CALL = "SEND_REJECTED_CALL",
  SEND_ANSWER_CALL = "SEND_ANSWER_CALL",
  END_CALL = "END_CALL",
  CONNECT_COMPUTER = "CONNECT_COMPUTER",
  CONNECT_WHITEBOARD = "CONNECT_WHITEBOARD",
  CREATE_COMPUTER = "CREATE_COMPUTER",
  CREATE_WHITEBOARD = "CREATE_WHITEBOARD",
  SCREEN_SHARING = "SCREEN_SHARING",
  SCREEN_SHARING_REQUEST = "SCREEN_SHARING_REQUEST",
  SCREEN_SHARING_RESPONSE = "SCREEN_SHARING_RESPONSE",
  UPDATE_ELEMENTS = "UPDATE_ELEMENTS",
  UPDATED_ELEMENTS = "UPDATED_ELEMENTS",
  SEND_WHITEBOARD_POINTER = "SEND_WHITEBOARD_POINTER",
  UPDATED_WHITEBOARD_POINTER = "UPDATED_WHITEBOARD_POINTER",
  UPDATE_CODE = "UPDATE_CODE",
  UPDATED_CODE = "UPDATED_CODE",
  UPDATE_CODE_AWARENESS = "UPDATE_CODE_AWARENESS",
  UPDATED_CODE_AWARENESS = "UPDATED_CODE_AWARENESS",
  REQUEST_CODE_SYNC = "REQUEST_CODE_SYNC",
  SEND_EMOTE = "SEND_EMOTE",
  UPDATED_EMOTE = "UPDATED_EMOTE",
  NPC_TALK_START = "NPC_TALK_START",
  NPC_TALK_END = "NPC_TALK_END",
  NPC_SAY = "NPC_SAY",
  NPC_SAID = "NPC_SAID",
  NPC_USER_SAY = "NPC_USER_SAY",
  NPC_USER_SAID = "NPC_USER_SAID",
  KICK_BALL = "KICK_BALL",
  UPDATE_BALL = "UPDATE_BALL",
  SEND_NUDGE = "SEND_NUDGE",
  NUDGED = "NUDGED",
}

export type MessagePayloadMap = {
  SEND_ROOM_DATA: RoomData;
  SEND_TOTAL_CLIENTS: { totalClients: number };
  UPDATE_PLAYER_STATUS: Status;
  UPDATE_PLAYER: Omit<
    IPlayer,
    | "name"
    | "readyToConnect"
    | "mediaConnect"
    | "videoEnabled"
    | "micEnabled"
    | "status"
    | "isCalling"
  >;
  UPDATE_PLAYER_NAME: string;
  READY_TO_CONNECT: void;
  UPDATE_MEDIA_CONNECT: boolean;
  UPDATE_MEDIA_ENABLED: { video?: boolean; microphone?: boolean };
  PUSH_CHAT_MESSAGE: string;
  UPDATED_CHAT_MESSAGE: { sessionId: string; message: string };
  UPDATED_CALLING: boolean;
  SEND_REJECTED_CALL: string;
  SEND_ANSWER_CALL: string;
  END_CALL: string;
  CONNECT_COMPUTER: { id: string; connect: boolean };
  CONNECT_WHITEBOARD: { id: string; connect: boolean };
  CREATE_COMPUTER: string;
  CREATE_WHITEBOARD: string;
  SCREEN_SHARING: { computerId: string; userId: string; shared: boolean };
  SCREEN_SHARING_REQUEST: { computerId: string; sharingId: string };
  SCREEN_SHARING_RESPONSE: string;
  UPDATE_ELEMENTS: { id: string; elements: readonly any[] };
  UPDATED_ELEMENTS: { id: string; elements: readonly any[] };
  // 화이트보드 라이브 커서: x/y는 Excalidraw scene 좌표(수신측이 자기 뷰포트로 변환).
  // UPDATED의 name은 서버가 state에서 채운다(스푸핑 방지). 저장 없는 휘발 채널
  SEND_WHITEBOARD_POINTER: { id: string; x: number; y: number; tool: "pointer" | "laser" };
  UPDATED_WHITEBOARD_POINTER: {
    id: string;
    sessionId: string;
    name: string;
    x: number;
    y: number;
    tool: "pointer" | "laser";
  };
  // 협업 코드 에디터: id는 computerId, update는 Yjs 바이너리(msgpack bin으로 그대로 전송됨).
  // UPDATED_CODE는 실시간 릴레이와 REQUEST_CODE_SYNC 응답(전체 상태 = 유효한 update) 겸용
  UPDATE_CODE: { id: string; update: Uint8Array };
  UPDATED_CODE: { id: string; update: Uint8Array };
  UPDATE_CODE_AWARENESS: { id: string; update: Uint8Array };
  UPDATED_CODE_AWARENESS: { id: string; update: Uint8Array };
  REQUEST_CODE_SYNC: string;
  SEND_EMOTE: string;
  UPDATED_EMOTE: { sessionId: string; emote: string };
  // AI NPC 대화: 시작/종료로 서버 잠금(한 명만), SAY는 점유자가 AI 답변을 보내면 서버가 모두에게 브로드캐스트
  NPC_TALK_START: void;
  NPC_TALK_END: void;
  NPC_SAY: string;
  NPC_SAID: { message: string };
  // 대화 중인 유저가 친 말 — 방의 다른 사람에게 그 유저 말풍선으로 전파(채팅 로그엔 안 남김)
  NPC_USER_SAY: string;
  NPC_USER_SAID: { sessionId: string; message: string };
  // 공유 물리 공: KICK은 소유권 주장(=찬 사람이 주인), UPDATE는 주인이 위치를 스트리밍
  KICK_BALL: { x: number; y: number };
  UPDATE_BALL: { x: number; y: number };
  // 콕 찌르기: SEND는 대상 sessionId, NUDGED의 이름은 서버 state에서 채운다(스푸핑 방지)
  SEND_NUDGE: string;
  NUDGED: { sessionId: string; name: string };
};
