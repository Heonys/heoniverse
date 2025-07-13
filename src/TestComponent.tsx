import { useEffect } from "react";
import { Network } from "./service/Network";
import { MessageType } from "@server/src/types";

const network = new Network();

export const TestComponent = () => {
  useEffect(() => {
    network.joinTestRoom().then(() => {
      network.onMessage(MessageType.SEND_ROOM_DATA, (msg) => {
        console.log(msg);
      });
    });
  }, []);

  const send = () => {
    network.sendMessage(MessageType.UPDATE_PLAYER, "플레이어 업데이트");
  };

  return (
    <div>
      <button onClick={send}>Send Message</button>
    </div>
  );
};
