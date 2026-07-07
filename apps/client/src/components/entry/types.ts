import { RoomAvailable } from "colyseus.js";
import { RoomMetadata } from "@heoniverse/shared";

export type CustomRoom = RoomAvailable<RoomMetadata>;

// 입장하기 전까지는 어떤 방도 join하지 않고 "선택"만 보관한다 (pre-join 구조)
export type RoomSelection =
  | { kind: "public" }
  | { kind: "offline" }
  | { kind: "custom"; roomId: string; name: string; description: string; password?: string }
  | { kind: "create"; name: string; description: string; password?: string };

export type Card1View = "select" | "custom" | "create" | "password" | "help";
