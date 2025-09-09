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
  private peer: Peer;
  private peersMap = new Map<string, MediaConnection>(); // host
  private connectedPeers = new Map<string, MediaConnection>(); // guest
  private network: Network;
  private videoStream?: MediaStream;
  screenStream?: MediaStream;
  mediaStreamsMap = new Map<Player, MediaStream>();
  connectedCall?: MediaConnection;

  constructor(peerId: string, network: Network) {
    this.peer = new Peer(peerId, {
      host: import.meta.env.PROD ? import.meta.env.VITE_PEER_URL : "localhost",
      port: Number(import.meta.env.VITE_PEER_PORT),
      path: "/peerjs",
      secure: false,
    });
    this.network = network;
    this.setupPeerEvents();
  }

  setupPeerEvents() {
    this.peer.on("call", (call) => {
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
    if (!this.connectedPeers.has(peerId)) {
      call.answer(this.videoStream);
      this.connectedPeers.set(call.peer, call);

      call.on("stream", (stream) => {
        const otherPlayer = this.getOtherPlayerById(peerId);
        if (otherPlayer) {
          this.mediaStreamsMap.set(otherPlayer, stream);
        }
      });
      call.on("close", () => this.closePeerCall(peerId));
    }
  }

  handleDirectCall(call: MediaConnection, peerId: string) {
    if (!this.connectedPeers.has(peerId)) {
      store.dispatch(setShowIphone(true));
      store.dispatch(setIsRinging({ state: true, caller: peerId }));

      eventEmitter.once("CALL_RESPONSE", (result) => {
        if (result === "answer") {
          call.answer(this.videoStream);
          this.network.sendAnswerCall(peerId);
          this.connectedPeers.set(call.peer, call);

          call.on("stream", (stream) => {
            const otherPlayer = this.getOtherPlayerById(peerId);
            if (otherPlayer) {
              this.mediaStreamsMap.set(otherPlayer, stream);
            }
          });
          call.on("close", () => this.onCloseCall(peerId));
        } else {
          this.network.sendRejectCall(peerId);
        }
      });
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

  peerCall(peerId: string, callType: CallType) {
    const currentConnections = this.peersMap.size + this.connectedPeers.size + 1;
    if (currentConnections >= MAX_PEERS) return;

    if (!this.peersMap.has(peerId)) {
      const call = this.peer.call(peerId, this.videoStream!, { metadata: { type: callType } });
      this.peersMap.set(peerId, call);

      call.on("stream", (mediaStream) => {
        const otherPlayer = this.getOtherPlayerById(peerId);
        if (otherPlayer) {
          this.mediaStreamsMap.set(otherPlayer, mediaStream);
        }
      });

      call.on("close", () => this.onCloseCall(peerId));
    }
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
    }
  }

  onCloseCall(peerId: string) {
    this.closePeerCall(peerId);
    this.network.updateIsCalling(false);
    store.dispatch(setCurrentPage({ page: "home" }));
    store.dispatch(setIsConnected({ state: false }));
  }

  setupMediaStream(stream: MediaStream) {
    this.videoStream = stream;
  }

  async getUserMedia() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      this.videoStream = stream;
      store.dispatch(setMediaConnected(true));
      this.network.updateMideaConnect(true);
      this.getLocalPlayer().mediaConnect = true;
      return true;
    } catch {
      return false;
    }
  }

  disConnectUserMedia() {
    if (this.videoStream) {
      this.videoStream.getTracks().forEach((track) => {
        track.stop();
        this.videoStream = undefined;
      });
      store.dispatch(setMediaConnected(false));
      store.dispatch(initMediaState());
      store.dispatch(setCurrentPage({ page: "home" }));
      store.dispatch(setIsConnected({ state: false }));
      this.network.updateMideaConnect(false);
      this.network.updateIsCalling(false);

      const localPlayer = this.getLocalPlayer();
      localPlayer.mediaConnect = false;
      localPlayer.readyToStream = false;
      localPlayer.setCallingState(false);
    }
  }

  getOtherPlayerById(playerId: string) {
    const gameScene = phaserGame.scene.keys.game as Game;
    return gameScene.ohterPlayersMap.get(playerId);
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
    const gameScene = phaserGame.scene.keys.game as Game;
    const playerId = gameScene.localPlayer.playerId;
    const computerId = store.getState().computer.computerId;
    const computer = gameScene.computersMap.get(computerId!);

    if (computer) {
      computer.connectedUsers.forEach((userId) => {
        if (playerId !== userId) {
          this.peer.call(userId, this.screenStream!, { metadata: { type: "screen" } });
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
  }

  callScreenShareToNewUser(userId: string) {
    if (this.screenStream) {
      this.peer.call(userId, this.screenStream, { metadata: { type: "screen" } });
    }
  }
}
