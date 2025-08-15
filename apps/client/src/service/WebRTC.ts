import { Peer } from "peerjs";
import { Network } from "@/service";

export class WebRTC {
  private peer: Peer;
  private network: Network;

  constructor(peerId: string, network: Network) {
    this.peer = new Peer(peerId);
    this.network = network;
  }
}
