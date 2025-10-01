import { Client, Room, getStateCallbacks } from "colyseus.js";
import { RoomType, Messages, MessagePayloadMap, IRoom } from "@heoniverse/shared";
import { StudioState } from "@server/rooms/schema/StudioSchema";
import { store } from "@/stores";
import {
  setJoinedRoomData,
  setLobbyJoined,
  setAvailableRoom,
  addAvailableRoom,
  removeAvailableRoom,
  setTotalClients,
} from "@/stores/roomSlice";
import { eventEmitter } from "@/game/events";
import { pushMessage } from "@/stores/chatSlice";
import { WebRTC } from "@/service";
import { phaserGame } from "@/game";
import { Game } from "@/game/scenes";
import { setCurrentPage, setIsConnected } from "@/stores/phoneSlice";
import { setSharing } from "@/stores/computerSlice";

export class Network {
  client: Client;
  room: Room<StudioState> | null = null;
  lobby: Room | null = null;
  sessionId!: string;
  webRTC?: WebRTC;

  constructor() {
    const endPoint = import.meta.env.PROD
      ? import.meta.env.VITE_WEBSOCKET_URL
      : "ws://localhost:2567";

    this.client = new Client(endPoint);
    this.joinLobbyRoom().then(() => {
      setTimeout(() => store.dispatch(setLobbyJoined(true)), import.meta.env.PROD ? 1500 : 0);
    });
    this.registerEventHandler();
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
      this.webRTC?.closePeerCall(peerId);
    });
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
    if (!this.room) return;

    await this.room.leave();
    this.room.removeAllListeners();
    this.room = null;
  }

  sendMessage<T extends keyof MessagePayloadMap>(type: T, message?: MessagePayloadMap[T]) {
    if (!this.room) {
      throw new Error("방에 입장하지 않았습니다.");
    }
    this.room.send(type, message);
  }

  onMessage<T extends keyof MessagePayloadMap>(
    type: T,
    callback: (message: MessagePayloadMap[T]) => void,
  ) {
    if (!this.room) {
      throw new Error("방에 입장하지 않았습니다.");
    }
    this.room.onMessage(type, callback);
  }

  readyToConnect() {
    this.sendMessage("READY_TO_CONNECT");
  }

  updateMideaConnect(payload: boolean) {
    this.sendMessage("UPDATE_MEDIA_CONNECT", payload);
  }

  updateMediaEnabled({ video, microphone }: { video?: boolean; microphone?: boolean }) {
    this.sendMessage("UPDATE_MEDIA_ENABELD", { video, microphone });
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

  updateWhiteboard(elements: readonly any[]) {
    this.sendMessage("UPDATE_ELEMENTS", elements);
  }

  setupRoom() {
    if (!this.room) return;
    this.lobby?.leave();
    store.dispatch(setLobbyJoined(false));
    this.webRTC = new WebRTC(this.room.sessionId, this);

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

    this.onMessage(Messages.SEND_ROOM_DATA, (data) => {
      store.dispatch(setJoinedRoomData(data));
    });

    this.onMessage(Messages.UPDATED_CHAT_MESSAGE, (payload) => {
      eventEmitter.emit("UPDATED_CHAT_MESSAGE", payload);
    });

    this.onMessage(Messages.SEND_REJECTED_CALL, (peerId) => {
      this.updateIsCalling(false);
      store.dispatch(setCurrentPage({ page: "home" }));
      store.dispatch(setIsConnected({ state: false }));
      eventEmitter.emit("CLOSE_PEER_CALL", peerId);
    });

    this.onMessage(Messages.SEND_ANSWER_CALL, () => {
      store.dispatch(setIsConnected({ state: true, startedAt: new Date() }));
    });

    this.onMessage(Messages.SCREEN_SHARING_RESPONSE, (receiverId) => {
      this.webRTC?.callScreenShareToNewUser(receiverId);
    });

    this.onMessage(Messages.UPDATED_ELEMENTS, (payload) => {
      if (payload.length > 0) {
        eventEmitter.emit("UPDATED_ELEMENTS", payload);
      }
    });
  }
}
