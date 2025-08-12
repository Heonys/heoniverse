import { Messages } from "@heoniverse/shared";
import { Client, LobbyRoom, matchMaker } from "colyseus";

export class CustomLobbyRoom extends LobbyRoom {
  async onJoin(client: Client) {
    const rooms = await matchMaker.query();
    const totalClients = rooms.reduce((acc, cur) => acc + cur.clients, 0);
    client.send(Messages.SEND_TOTAL_CLIENTS, { totalClients });
  }
}
