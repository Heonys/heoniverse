import { Client, Room, getStateCallbacks } from "colyseus.js";
import { RoomType, Messages, MessagePayloadMap, IRoom } from "@heoniverse/shared";
import { StudioState } from "@server/rooms/schema/StudioSchema";
import { store } from "@/stores";
import {
  setJoinedRoomData,
  setLobbyJoined,
  setLobbyStatus,
  setLobbyWaking,
  setReconnecting,
  setAvailableRoom,
  addAvailableRoom,
  removeAvailableRoom,
  setTotalClients,
} from "@/stores/roomSlice";
import { eventEmitter } from "@/game/events";
import { pushMessage } from "@/stores/chatSlice";
import { WebRTC } from "@/service";
import { ReconnectSession, saveSession, loadSession, updateSession, clearSession } from "@/service";
import { phaserGame } from "@/game";
import { Game } from "@/game/scenes";
import type { Preloader } from "@/game/scenes";
import { setIsConnected } from "@/stores/phoneSlice";
import { setSharing } from "@/stores/computerSlice";
import { nanoid } from "@reduxjs/toolkit";
import { setSingleMode } from "@/stores/userSlice";

export class Network {
  client: Client;
  room: Room<StudioState> | null = null;
  lobby: Room | null = null;
  sessionId!: string;
  webRTC?: WebRTC;
  // 보드별 마지막 수신 요소 — WhiteBoard가 lazy 청크 로딩 등으로 늦게 마운트해도 스냅샷을 놓치지 않게 보관
  private whiteboardElements = new Map<string, readonly any[]>();

  constructor() {
    const endPoint = import.meta.env.PROD
      ? import.meta.env.VITE_WEBSOCKET_URL
      : "ws://localhost:2567";

    this.client = new Client(endPoint);

    // 탭을 닫거나 새로고침하기 직전, 최신 재접속 토큰과 위치를 저장해둔다
    // (pagehide는 모바일/bfcache 등 beforeunload가 안 뜨는 상황까지 커버)
    window.addEventListener("beforeunload", this.persistSessionOnUnload);
    window.addEventListener("pagehide", this.persistSessionOnUnload);

    // 저장된 세션이 있으면 로비/메뉴를 건너뛰고 곧장 이전 방으로 재접속을 시도한다
    const saved = loadSession();
    if (saved) {
      this.restoreSession(saved);
    } else {
      this.connectToLobby();
    }
    this.registerEventHandler();
  }

  // 예기치 않은 종료(새로고침·탭 닫기) 직전에 회전된 토큰과 현재 좌표를 병합 저장.
  // 로그인 전이면 저장된 세션 자체가 없어 updateSession이 조용히 무시된다.
  private persistSessionOnUnload = () => {
    if (!this.room || store.getState().user.single) return;
    const gameScene = phaserGame.scene.keys.game as Game | undefined;
    const local = gameScene?.localPlayer;
    if (!local) return;
    updateSession({ reconnectionToken: this.room.reconnectionToken, x: local.x, y: local.y });
  };

  // 로그인 완료 시점에 세션 저장(방·프로필 스냅샷). 오프라인 모드에선 room이 없어 저장 안 함.
  persistSession() {
    if (!this.room || store.getState().user.single) return;
    const { name, description, roomType } = store.getState().room;
    const local = this.getLocalPlayer();
    saveSession({
      reconnectionToken: this.room.reconnectionToken,
      roomId: this.room.roomId,
      roomName: name,
      description,
      roomType: roomType ?? RoomType.PUBLIC,
      nickname: local.playerName.text,
      avatar: local.playerTexture,
      x: local.x,
      y: local.y,
    });
  }

  // 부팅 시 자동 재접속: 실패(유예 초과·토큰 무효·서버 재시작)하면 세션을 버리고 정상 메뉴로 폴백.
  private async restoreSession(saved: ReconnectSession) {
    store.dispatch(setReconnecting(true));
    try {
      this.room = await this.client.reconnect<StudioState>(saved.reconnectionToken);
    } catch (error) {
      console.warn("재접속에 실패해 메뉴로 돌아갑니다:", error);
      clearSession();
      store.dispatch(setReconnecting(false));
      this.connectToLobby();
      return;
    }

    this.setupRoom();
    // 재접속하면 토큰이 회전되므로 즉시 저장 (beforeunload에만 의존하지 않게 — 연속 새로고침 견고화)
    updateSession({ reconnectionToken: this.room.reconnectionToken });
    // 재접속 시엔 onJoin/SEND_ROOM_DATA가 다시 오지 않으므로 방 정보를 세션에서 복원한다
    store.dispatch(
      setJoinedRoomData({
        id: saved.roomId,
        name: saved.roomName,
        description: saved.description,
        roomType: saved.roomType,
      }),
    );

    // 저장된 좌표/아바타/닉네임으로 씬을 띄운다(스폰 지점·기본 아바타 깜빡임 방지).
    // 로딩이 아직이면 launchGame이 완료 후 자동 실행한다.
    const preloader = phaserGame.scene.keys.preloader as Preloader;
    preloader.launchGame({
      x: saved.x,
      y: saved.y,
      avatar: saved.avatar,
      nickname: saved.nickname,
    });
  }

  // 무료 호스팅(Render)은 유휴 시 서버가 잠들고 첫 접속에 ~1분 정도 걸리므로
  // 깨어날 때까지 재시도한다. 최종 실패 시 UI가 오프라인 모드를 안내한다.
  private async connectToLobby() {
    const MAX_ATTEMPTS = 6;
    const RETRY_DELAY_MS = 15_000;
    const WAKE_HINT_MS = 5_000;

    store.dispatch(setLobbyStatus({ status: "connecting", attempt: 1 }));

    // 첫 시도가 콜드스타트로 오래 hang돼도 ~5초 뒤엔 "서버 켜는 중" 안내 + 오프라인 버튼을 노출한다
    // (joinOrCreate엔 타임아웃이 없어 attempt가 1에 머물기 때문)
    const wakeTimer = setTimeout(() => {
      if (!store.getState().room.lobbyJoined && !store.getState().user.single) {
        store.dispatch(setLobbyWaking(true));
      }
    }, WAKE_HINT_MS);

    try {
      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        // 재시도 중 사용자가 오프라인 모드로 진입했으면 중단
        if (store.getState().user.single) return;

        try {
          await this.joinLobbyRoom();
          // 접속 대기 중 오프라인 모드로 빠졌다면, 늦게 연결된 로비가 오프라인 상태를 덮어쓰지 않게 폐기
          if (store.getState().user.single) {
            this.lobby?.leave().catch(() => {});
            this.lobby = null;
            this.room = null;
            return;
          }
          store.dispatch(setLobbyJoined(true));
          return;
        } catch (error) {
          console.error(`로비 접속 실패 (${attempt}/${MAX_ATTEMPTS}):`, error);
          store.dispatch(setLobbyWaking(true));
          if (attempt < MAX_ATTEMPTS) {
            store.dispatch(setLobbyStatus({ status: "connecting", attempt: attempt + 1 }));
            await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
          }
        }
      }
      store.dispatch(setLobbyStatus({ status: "failed" }));
    } finally {
      clearTimeout(wakeTimer);
    }
  }

  registerEventHandler() {
    eventEmitter.on("UPDATE_PLAYER_NAME", (payload) => {
      this.sendMessage("UPDATE_PLAYER_NAME", payload);
    });

    eventEmitter.on("UPDATE_PLAYER_TEXTURE", (payload) => {
      this.sendMessage("UPDATE_PLAYER", payload);
    });

    eventEmitter.on("UPDATE_PLAYER_STATUS", (payload) => {
      this.sendMessage("UPDATE_PLAYER_STATUS", payload);
    });

    eventEmitter.on("CLOSE_PEER_CALL", (peerId) => {
      this.webRTC?.closePeerCall(peerId);
    });

    eventEmitter.on("DISCONNECT_PEER_CALL", (peerId) => {
      this.webRTC?.handlePeerLeft(peerId);
    });
  }

  // 전화 끊기: 상대에게 종료 신호를 보내고 내 통화 상태도 정리 (peerjs close에 의존하지 않음)
  hangUp(peerId: string) {
    this.sendMessage("END_CALL", peerId);
    this.webRTC?.endCall(peerId);
  }

  async joinLobbyRoom() {
    this.lobby = await this.client.joinOrCreate(RoomType.LOBBY);
    this.room = this.lobby;

    this.lobby.onMessage("rooms", (rooms) => {
      store.dispatch(setAvailableRoom(rooms));
    });

    this.lobby.onMessage("+", ([_roomId, room]) => {
      store.dispatch(addAvailableRoom(room));
    });

    this.lobby.onMessage("-", (roomId) => {
      store.dispatch(removeAvailableRoom(roomId));
    });

    this.onMessage(Messages.SEND_TOTAL_CLIENTS, ({ totalClients }) => {
      store.dispatch(setTotalClients(totalClients));
    });
  }

  async joinPublicRoom() {
    this.room = await this.client.joinOrCreate(RoomType.PUBLIC);
    this.setupRoom();
  }

  async joinCustomRoom(roomId: string, password?: string) {
    this.room = await this.client.joinById(roomId, { password });
    this.setupRoom();
  }

  async createCustomRoom(room: IRoom) {
    this.room = await this.client.create(RoomType.CUSTOM, room);
    this.setupRoom();
  }

  async leaveCurrentRoom() {
    // 의도적 퇴장이므로 자동 재접속 세션을 폐기한다
    clearSession();
    this.webRTC?.dispose();
    this.webRTC = undefined;

    if (!this.room) return;

    await this.room.leave();
    this.room.removeAllListeners();
    this.room = null;
  }

  // 오프라인 모드에선 room이 없으므로 두 메서드 모두 조용히 무시한다
  sendMessage<T extends keyof MessagePayloadMap>(type: T, message?: MessagePayloadMap[T]) {
    this.room?.send(type, message);
  }

  onMessage<T extends keyof MessagePayloadMap>(
    type: T,
    callback: (message: MessagePayloadMap[T]) => void,
  ) {
    this.room?.onMessage(type, callback);
  }

  readyToConnect() {
    this.sendMessage("READY_TO_CONNECT");
  }

  // AI NPC 대화 잠금 획득/해제, 그리고 AI 답변을 방 전체에 브로드캐스트
  startNpcTalk() {
    this.sendMessage("NPC_TALK_START");
  }

  endNpcTalk() {
    this.sendMessage("NPC_TALK_END");
  }

  sayAsNpc(message: string) {
    this.sendMessage("NPC_SAY", message);
  }

  updateMediaConnect(payload: boolean) {
    this.sendMessage("UPDATE_MEDIA_CONNECT", payload);
  }

  updateMediaEnabled({ video, microphone }: { video?: boolean; microphone?: boolean }) {
    this.sendMessage("UPDATE_MEDIA_ENABLED", { video, microphone });
  }

  updateIsCalling(payload: boolean) {
    const game = phaserGame.scene.keys.game as Game;
    const localPlayer = game.localPlayer;
    localPlayer.setCallingState(payload);
    this.sendMessage("UPDATED_CALLING", payload);
  }

  sendRejectCall(peerId: string) {
    this.sendMessage("SEND_REJECTED_CALL", peerId);
  }

  sendAnswerCall(peerId: string) {
    this.sendMessage("SEND_ANSWER_CALL", peerId);
  }

  sendNudge(peerId: string) {
    this.sendMessage("SEND_NUDGE", peerId);
  }

  createComputer(id: string) {
    this.sendMessage("CREATE_COMPUTER", id);
  }

  createWhiteboard(id: string) {
    this.sendMessage("CREATE_WHITEBOARD", id);
  }

  connectToComputer(id: string, connect: boolean) {
    this.sendMessage("CONNECT_COMPUTER", { id, connect });
  }

  connectToWhiteboard(id: string, connect: boolean) {
    this.sendMessage("CONNECT_WHITEBOARD", { id, connect });
  }

  getLocalPlayer() {
    const gameScene = phaserGame.scene.keys.game as Game;
    return gameScene.localPlayer;
  }

  screenSharing(shared: boolean) {
    const { computerId } = store.getState().computer;
    const userId = this.getLocalPlayer().playerId;
    if (computerId) {
      this.sendMessage("SCREEN_SHARING", { computerId, userId, shared });
    }
  }
  screenSharingRequest(computerId: string, sharingId: string) {
    this.sendMessage("SCREEN_SHARING_REQUEST", { computerId, sharingId });
  }

  updateWhiteboard(id: string, elements: readonly any[]) {
    this.whiteboardElements.set(id, elements);
    this.sendMessage("UPDATE_ELEMENTS", { id, elements });
  }

  getWhiteboardElements(id: string) {
    return this.whiteboardElements.get(id);
  }

  async joinSingleRoom() {
    // 오프라인 모드는 재접속 대상이 아니므로 저장된 세션이 있으면 지운다
    clearSession();
    store.dispatch(setLobbyJoined(false));
    store.dispatch(setSingleMode(true));
    this.sessionId = nanoid(10);
    this.webRTC?.dispose();
    this.webRTC = new WebRTC(this.sessionId, this, { offline: true });

    store.dispatch(
      setJoinedRoomData({
        id: this.sessionId,
        name: "Offline Mode",
        description: "서버 연결이 제한된 오프라인 환경으로, UI 및 인터랙션을 확인할 수 있습니다.",
        roomType: RoomType.CUSTOM,
      }),
    );
  }

  setupRoom() {
    if (!this.room) return;
    this.lobby?.leave();
    store.dispatch(setLobbyJoined(false));
    this.webRTC?.dispose();
    this.webRTC = new WebRTC(this.room.sessionId, this);
    this.whiteboardElements.clear();

    this.sessionId = this.room.sessionId;
    const $ = getStateCallbacks(this.room);

    $(this.room.state).players.onAdd((player, sessionId) => {
      if (this.sessionId === sessionId) return;

      $(player).onChange(() => {
        eventEmitter.emit("OTHER_PLAYER_UPDATED", { sessionId, player });
      });

      $(player).listen("name", (name) => {
        if (name !== "") {
          setTimeout(() => {
            eventEmitter.emit("OTHER_PLAYER_JOINED", { sessionId, player });
          }, 100);
        }
      });

      $(player).listen("status", (status) => {
        eventEmitter.emit("RENDER_TO_STATUS", { id: sessionId, status });
      });
    });

    $(this.room.state).players.onRemove((player, sessionId) => {
      eventEmitter.emit("DISCONNECT_PEER_CALL", sessionId);
      setTimeout(() => {
        eventEmitter.emit("OTHER_PLAYER_LEFT", { sessionId, player });
      });
    });

    $(this.room.state).messages.onAdd((message) => {
      store.dispatch(pushMessage(message));
    });

    $(this.room.state).computers.onAdd((computer, computerId) => {
      $(computer).connectedUser.onAdd((userId) => {
        setTimeout(() => {
          eventEmitter.emit("COMPUTER_USER_ADDED", { userId, computerId });
        });
      });

      $(computer).connectedUser.onRemove((userId) => {
        eventEmitter.emit("COMPUTER_USER_REMOVED", { userId, computerId });
      });

      $(computer).onChange(() => {
        const { sharingUserId, isSharing } = computer;
        if (sharingUserId !== "") {
          store.dispatch(setSharing({ computerId, sharingUserId, isSharing }));
        }
      });
    });

    $(this.room.state).whiteboards.onAdd((whiteboard, whiteboardId) => {
      $(whiteboard).connectedUser.onAdd((userId) => {
        setTimeout(() => {
          eventEmitter.emit("WHITEBOARD_USER_ADDED", { userId, whiteboardId });
        });
      });

      $(whiteboard).connectedUser.onRemove((userId) => {
        eventEmitter.emit("WHITEBOARD_USER_REMOVED", { userId, whiteboardId });
      });
    });

    // AI NPC 대화 잠금 상태 — 모든 클라가 누가 점유 중인지 알도록 상태를 구독
    $(this.room.state).listen("npcTalkingUser", (sessionId) => {
      eventEmitter.emit("NPC_TALKING_CHANGED", { sessionId });
    });

    // 공유 물리 공의 위치·주인 변화 — Game 씬이 받아 공 스프라이트에 반영.
    // ball은 중첩 스키마라 초기 디코드 전엔 refId가 없다 → listen으로 값이 준비된 뒤 onChange를 건다.
    $(this.room.state).listen("ball", (ball) => {
      const emit = () =>
        eventEmitter.emit("BALL_CHANGED", { x: ball.x, y: ball.y, ownerId: ball.ownerId });
      $(ball).onChange(emit);
      emit(); // 초기 상태 1회 반영
    });

    this.onMessage(Messages.SEND_ROOM_DATA, (data) => {
      store.dispatch(setJoinedRoomData(data));
    });

    this.onMessage(Messages.NPC_SAID, (payload) => {
      eventEmitter.emit("NPC_SAID", payload);
    });

    this.onMessage(Messages.NPC_USER_SAID, (payload) => {
      eventEmitter.emit("NPC_USER_SAID", payload);
    });

    this.onMessage(Messages.UPDATED_CHAT_MESSAGE, (payload) => {
      eventEmitter.emit("UPDATED_CHAT_MESSAGE", payload);
    });

    this.onMessage(Messages.UPDATED_EMOTE, (payload) => {
      eventEmitter.emit("UPDATED_EMOTE", payload);
    });

    this.onMessage(Messages.SEND_REJECTED_CALL, (peerId) => {
      this.webRTC?.endCall(peerId);
    });

    this.onMessage(Messages.SEND_ANSWER_CALL, () => {
      store.dispatch(setIsConnected({ state: true, startedAt: new Date() }));
    });

    this.onMessage(Messages.END_CALL, (peerId) => {
      this.webRTC?.endCall(peerId);
    });

    this.onMessage(Messages.SCREEN_SHARING_RESPONSE, (receiverId) => {
      this.webRTC?.callScreenShareToNewUser(receiverId);
    });

    this.onMessage(Messages.NUDGED, (payload) => {
      eventEmitter.emit("NUDGED", payload);
    });

    this.onMessage(Messages.UPDATED_ELEMENTS, (payload) => {
      if (payload.elements.length > 0) {
        this.whiteboardElements.set(payload.id, payload.elements);
        eventEmitter.emit("UPDATED_ELEMENTS", payload);
      }
    });
  }
}
