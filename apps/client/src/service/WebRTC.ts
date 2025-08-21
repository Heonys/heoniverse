import { Peer, type MediaConnection } from "peerjs";
import { Network } from "@/service";
import { initMediaState, setMediaConnected } from "@/stores/userSlice";
import { store } from "@/stores";
import { Player } from "@/game/characters";
import { phaserGame } from "@/game";
import { Game } from "@/game/scenes";

export class WebRTC {
  private peer: Peer;
  private peersMap = new Map<string, MediaConnection>(); // host
  private connectedPeers = new Map<string, MediaConnection>(); // guest
  private network: Network;
  private stream?: MediaStream;
  mediaStreamsMap = new Map<Player, MediaStream>();

  constructor(peerId: string, network: Network) {
    this.peer = new Peer(peerId);
    this.network = network;
    this.setupPeerEvents();
  }

  setupPeerEvents() {
    this.peer.on("call", (call) => {
      const peerId = call.peer;
      if (!this.connectedPeers.has(peerId)) {
        call.answer(this.stream);
        this.connectedPeers.set(call.peer, call);

        call.on("stream", (stream: MediaStream) => {
          const otherPlayer = this.getOtherPlayerById(peerId);
          if (otherPlayer) {
            this.mediaStreamsMap.set(otherPlayer, stream);
          }
        });

        call.on("close", () => {
          if (this.connectedPeers.has(peerId)) {
            const connectedPeer = this.connectedPeers.get(peerId);
            connectedPeer?.close();
            this.connectedPeers.delete(peerId);

            const otherPlayer = this.getOtherPlayerById(peerId);
            if (otherPlayer) {
              this.mediaStreamsMap.delete(otherPlayer);
            }
          }
        });
      }
    });
  }

  peerCall(peerId: string) {
    if (!this.peersMap.has(peerId)) {
      const call = this.peer.call(peerId, this.stream!);
      this.peersMap.set(peerId, call);

      call.on("stream", (mediaStream) => {
        const otherPlayer = this.getOtherPlayerById(peerId);
        if (otherPlayer) {
          this.mediaStreamsMap.set(otherPlayer, mediaStream);
        }
      });
    }
  }

  closePeerCall(peerId: string) {
    if (this.peersMap.has(peerId)) {
      const calledPeer = this.peersMap.get(peerId);
      calledPeer?.close();
      this.peersMap.delete(peerId);

      const otherPlayer = this.getOtherPlayerById(peerId);
      if (otherPlayer) {
        this.mediaStreamsMap.delete(otherPlayer);
      }
    }
  }

  setupMediaStream(stream: MediaStream) {
    this.stream = stream;
  }

  getUserMedia() {
    navigator.mediaDevices //
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        this.stream = stream;
        store.dispatch(setMediaConnected(true));
        this.network.updateMideaConnect(true);
      });
  }

  disConnectUserMedia() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => {
        track.stop();
        this.stream = undefined;
      });
      store.dispatch(setMediaConnected(false));
      store.dispatch(initMediaState());
      this.network.updateMideaConnect(false);
    }
  }

  getOtherPlayerById(playerId: string) {
    const gameScene = phaserGame.scene.keys.game as Game;
    return gameScene.ohterPlayersMap.get(playerId);
  }
}
