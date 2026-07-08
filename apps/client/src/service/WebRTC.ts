import { Peer, type MediaConnection } from "peerjs";
import { Network } from "@/service";
import { initMediaState, setMediaConnected } from "@/stores/userSlice";
import { store } from "@/stores";
import { Player } from "@/game/characters";
import { phaserGame } from "@/game";
import { Game } from "@/game/scenes";
import { setCurrentPage, setIsConnected, setIsRinging, setShowIphone } from "@/stores/phoneSlice";
import { eventEmitter } from "@/game/events";

type CallType = "direct" | "proximity" | "screen";
const MAX_PEERS = 4;

export class WebRTC {
  // 오프라인 모드에선 통화 기능이 없으므로 peerjs cloud에 연결하는 Peer를 만들지 않는다
  private peer?: Peer;
  private peersMap = new Map<string, MediaConnection>(); // host
  private connectedPeers = new Map<string, MediaConnection>(); // guest
  private screenCallsMap = new Map<string, MediaConnection>(); // 화면공유 발신 콜
  private network: Network;
  private videoStream?: MediaStream;
  screenStream?: MediaStream;
  mediaStreamsMap = new Map<Player, MediaStream>();
  connectedCall?: MediaConnection;
  // 전화(direct) 통화 상태 추적 — 종료/퇴장 시 어느 정리 경로를 탈지 판단용
  private ringingPeer?: string; // 나에게 전화 걸어와 울리는 중인 상대
  private activeCallPeer?: string; // 현재 전화 통화 중/발신 중인 상대
  private pendingCallResponse?: (result: "answer" | "reject") => void;

  constructor(peerId: string, network: Network, options?: { offline?: boolean }) {
    this.network = network;
    if (!options?.offline) {
      this.peer = new Peer(peerId);
      this.setupPeerEvents();
    }
  }

  setupPeerEvents() {
    this.peer?.on("call", (call) => {
      const callType = call.metadata.type as CallType;
      const peerId = call.peer;

      switch (callType) {
        case "proximity": {
          return this.handleProximityCall(call, peerId);
        }
        case "direct": {
          return this.handleDirectCall(call, peerId);
        }
        case "screen": {
          return this.handleScreenShareCall(call);
        }
      }
    });
  }

  handleProximityCall(call: MediaConnection, peerId: string) {
    const currentConnections = this.peersMap.size + this.connectedPeers.size + 1;
    if (currentConnections >= MAX_PEERS) {
      call.close();
      return;
    }

    if (!this.connectedPeers.has(peerId)) {
      call.answer(this.videoStream);
      this.connectedPeers.set(call.peer, call);

      call.on("stream", (stream) => {
        const otherPlayer = this.getOtherPlayerById(peerId);
        if (otherPlayer) {
          this.mediaStreamsMap.set(otherPlayer, stream);
          eventEmitter.emit("MEDIA_STREAMS_CHANGED");
        }
      });
      call.on("close", () => this.closePeerCall(peerId));
    }
  }

  handleDirectCall(call: MediaConnection, peerId: string) {
    if (!this.connectedPeers.has(peerId)) {
      store.dispatch(setShowIphone(true));
      store.dispatch(setIsRinging({ state: true, caller: peerId }));
      this.ringingPeer = peerId;

      // 발신자가 울리는 중 나가면 이 리스너를 취소할 수 있도록 ref로 보관
      this.clearPendingCallResponse();
      const handler = (result: "answer" | "reject") => {
        this.clearPendingCallResponse();
        this.ringingPeer = undefined;
        if (result === "answer") {
          this.activeCallPeer = peerId;
          call.answer(this.videoStream);
          this.network.sendAnswerCall(peerId);
          this.connectedPeers.set(call.peer, call);

          call.on("stream", (stream) => {
            const otherPlayer = this.getOtherPlayerById(peerId);
            if (otherPlayer) {
              this.mediaStreamsMap.set(otherPlayer, stream);
              eventEmitter.emit("MEDIA_STREAMS_CHANGED");
            }
          });
          call.on("close", () => this.endCall(peerId));
        } else {
          this.network.sendRejectCall(peerId);
        }
      };
      this.pendingCallResponse = handler;
      eventEmitter.on("CALL_RESPONSE", handler);
    }
  }

  handleScreenShareCall(call: MediaConnection) {
    call.answer();
    this.connectedCall = call;

    call.on("stream", (stream) => {
      this.screenStream = stream;
    });

    call.on("close", () => {
      this.connectedCall = undefined;
    });
  }

  // 통화를 실제로 걸었으면 true, 이미 연결됐거나 한도 초과 등으로 못 걸면 false
  peerCall(peerId: string, callType: CallType): boolean {
    if (!this.peer) return false;
    const currentConnections = this.peersMap.size + this.connectedPeers.size + 1;
    if (currentConnections >= MAX_PEERS) return false;
    if (this.peersMap.has(peerId)) return false;

    const call = this.peer.call(peerId, this.videoStream!, { metadata: { type: callType } });
    // 피어가 아직 시그널링 서버에 완전히 open 되기 전이면 call이 undefined로 온다.
    // 여기서 막지 않으면 아래 call.on(...)에서 터진다 — false 반환 시 다음 프레임에 재시도된다.
    if (!call) return false;
    this.peersMap.set(peerId, call);
    if (callType === "direct") this.activeCallPeer = peerId;

    call.on("stream", (mediaStream) => {
      const otherPlayer = this.getOtherPlayerById(peerId);
      if (otherPlayer) {
        this.mediaStreamsMap.set(otherPlayer, mediaStream);
        eventEmitter.emit("MEDIA_STREAMS_CHANGED");
      }
    });

    // 전화 콜만 종료 시 전화 UI까지 리셋, 근접 콜은 연결만 정리
    call.on("close", () => {
      if (callType === "direct") this.endCall(peerId);
      else this.closePeerCall(peerId);
    });
    return true;
  }

  closePeerCall(peerId: string) {
    if (this.peersMap.has(peerId)) {
      const calledPeer = this.peersMap.get(peerId);
      calledPeer?.close();
      this.peersMap.delete(peerId);
      this.cleanUpStream(peerId);
    }

    if (this.connectedPeers.has(peerId)) {
      const calledPeer = this.connectedPeers.get(peerId);
      calledPeer?.close();
      this.connectedPeers.delete(peerId);
      this.cleanUpStream(peerId);
    }
  }

  cleanUpStream(peerId: string) {
    const otherPlayer = this.getOtherPlayerById(peerId);
    if (otherPlayer) {
      this.mediaStreamsMap.delete(otherPlayer);
      eventEmitter.emit("MEDIA_STREAMS_CHANGED");
    }
  }

  private clearPendingCallResponse() {
    if (this.pendingCallResponse) {
      eventEmitter.off("CALL_RESPONSE", this.pendingCallResponse);
      this.pendingCallResponse = undefined;
    }
  }

  // 전화 통화 전체 종료 — peer/스트림 정리 + 통화 상태·전화 UI 리셋 (양쪽에서 동일하게 호출)
  endCall(peerId: string) {
    this.clearPendingCallResponse();
    this.ringingPeer = undefined;
    this.activeCallPeer = undefined;
    this.closePeerCall(peerId);
    this.network.updateIsCalling(false);
    store.dispatch(setIsRinging({ state: false }));
    store.dispatch(setCurrentPage({ page: "home" }));
    store.dispatch(setIsConnected({ state: false }));
  }

  // 나에게 걸려와 울리던 전화가 취소됨(발신자 퇴장 등) — 벨 UI만 정리
  cancelIncomingCall(peerId: string) {
    if (this.ringingPeer !== peerId) return;
    this.clearPendingCallResponse();
    this.ringingPeer = undefined;
    store.dispatch(setIsRinging({ state: false }));
  }

  // 상대 퇴장 시: 통화 상대면 전체 종료, 울리던 발신자면 벨 취소, 그 외(근접)는 연결만 정리
  handlePeerLeft(peerId: string) {
    if (this.activeCallPeer === peerId) {
      this.endCall(peerId);
    } else if (this.ringingPeer === peerId) {
      this.cancelIncomingCall(peerId);
    } else {
      this.closePeerCall(peerId);
    }
  }

  setupMediaStream(stream: MediaStream) {
    // getUserMedia로 연 스트림을 react-webcam이 연 스트림으로 교체할 때
    // 이전 스트림 트랙을 정리하지 않으면 카메라가 계속 켜진 채 남는다
    if (this.videoStream && this.videoStream !== stream) {
      this.videoStream.getTracks().forEach((track) => track.stop());
    }
    this.videoStream = stream;
  }

  async getUserMedia() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      this.videoStream = stream;
      store.dispatch(setMediaConnected(true));
      this.network.updateMediaConnect(true);
      this.getLocalPlayer().mediaConnect = true;
      // 미디어 권한을 허용한 직후가 알림(콕 찌르기 수신) 권한을 묻기 가장 자연스러운 순간.
      // 거부돼도 인앱 토스트는 동작하므로 fire-and-forget.
      if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission();
      }
      return true;
    } catch (error) {
      // 권한 거부·비보안 컨텍스트 등 실패 원인을 남긴다 (배포 환경 디버깅용)
      console.error("카메라/마이크 접근 실패:", error);
      return false;
    }
  }

  disConnectUserMedia() {
    if (this.videoStream) {
      this.videoStream.getTracks().forEach((track) => track.stop());
      this.videoStream = undefined;
      store.dispatch(setMediaConnected(false));
      store.dispatch(initMediaState());
      store.dispatch(setCurrentPage({ page: "home" }));
      store.dispatch(setIsConnected({ state: false }));
      this.network.updateMediaConnect(false);
      this.network.updateIsCalling(false);

      const localPlayer = this.getLocalPlayer();
      localPlayer.mediaConnect = false;
      localPlayer.readyToStream = false;
      localPlayer.setCallingState(false);
    }
  }

  getOtherPlayerById(playerId: string) {
    const gameScene = phaserGame.scene.keys.game as Game;
    return gameScene.otherPlayersMap.get(playerId);
  }

  getLocalPlayer() {
    const gameScene = phaserGame.scene.keys.game as Game;
    return gameScene.localPlayer;
  }

  async startScreenShare() {
    return window.navigator.mediaDevices //
      .getDisplayMedia({ video: true, audio: true })
      .then((stream) => {
        const track = stream.getVideoTracks()[0];
        track.onended = () => this.stopScreenShare();

        this.screenStream = stream;
        this.network.screenSharing(true);
        this.broadcastScreenShare();
        return stream;
      });
  }

  broadcastScreenShare() {
    if (!this.peer) return;
    const peer = this.peer;
    const gameScene = phaserGame.scene.keys.game as Game;
    const playerId = gameScene.localPlayer.playerId;
    const computerId = store.getState().computer.computerId;
    const computer = gameScene.computersMap.get(computerId!);

    if (computer) {
      computer.connectedUsers.forEach((userId) => {
        if (playerId !== userId) {
          const call = peer.call(userId, this.screenStream!, { metadata: { type: "screen" } });
          this.screenCallsMap.set(userId, call);
        }
      });
    }
  }

  stopScreenShare() {
    if (this.screenStream) {
      this.screenStream.getTracks().forEach((track) => track.stop());
      this.screenStream = undefined;
      this.network.screenSharing(false);
    }
    this.screenCallsMap.forEach((call) => call.close());
    this.screenCallsMap.clear();
  }

  callScreenShareToNewUser(userId: string) {
    if (this.peer && this.screenStream) {
      const call = this.peer.call(userId, this.screenStream, { metadata: { type: "screen" } });
      this.screenCallsMap.set(userId, call);
    }
  }

  dispose() {
    this.peersMap.forEach((call) => call.close());
    this.peersMap.clear();
    this.connectedPeers.forEach((call) => call.close());
    this.connectedPeers.clear();
    this.screenCallsMap.forEach((call) => call.close());
    this.screenCallsMap.clear();
    this.connectedCall?.close();
    this.connectedCall = undefined;

    this.videoStream?.getTracks().forEach((track) => track.stop());
    this.videoStream = undefined;
    this.screenStream?.getTracks().forEach((track) => track.stop());
    this.screenStream = undefined;

    this.mediaStreamsMap.clear();
    eventEmitter.emit("MEDIA_STREAMS_CHANGED");
    this.peer?.removeAllListeners();
    this.peer?.destroy();
    this.peer = undefined;
  }
}
