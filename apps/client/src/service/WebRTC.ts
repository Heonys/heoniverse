import { Peer } from "peerjs";
import { Network } from "@/service";
import { initMediaState, setMediaConnected } from "@/stores/userSlice";
import { store } from "@/stores";

export class WebRTC {
  private peer: Peer;
  private network: Network;
  private stream?: MediaStream;

  constructor(peerId: string, network: Network) {
    this.peer = new Peer(peerId);
    this.network = network;
  }

  getUserMedia() {
    navigator.mediaDevices //
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        this.stream = stream;
        store.dispatch(setMediaConnected(true));
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
    }
  }
}
