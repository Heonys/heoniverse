import { RoomAvailable } from "colyseus.js";
import { RoomMetadata, RoomType } from "@heoniverse/shared";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isCustomRoom } from "@/utils";
// 리프 모듈에서 직접 import (service 배럴은 Network를 끌어와 순환 참조가 된다)
import { loadSession } from "@/service/session";

// connecting: 접속 시도 중 (잠든 서버 깨우기 재시도 포함) / failed: 재시도 소진
export type LobbyStatus = "connecting" | "connected" | "failed";

const roomSlice = createSlice({
  name: "room",
  initialState: {
    lobbyJoined: false,
    lobbyStatus: "connecting" as LobbyStatus,
    lobbyAttempt: 0,
    // 접속이 오래 걸리면(콜드스타트 hang) true — "서버 켜는 중" 안내와 오프라인 버튼을 노출한다
    lobbyWaking: false,
    // 부팅 시 저장된 세션으로 자동 재접속을 시도하는 동안 true — 그 사이 메뉴가 깜빡이지 않게 오버레이를 띄운다.
    // 세션이 있으면 첫 렌더부터 오버레이가 보이도록 초기값을 세션 유무로 정한다.
    reconnecting: loadSession() !== null,
    id: "",
    name: "",
    description: "",
    roomType: null as RoomType | null,
    availableRooms: [] as RoomAvailable<RoomMetadata>[],
    totalClients: 0,
  },
  reducers: {
    setLobbyJoined: (state, action: PayloadAction<boolean>) => {
      state.lobbyJoined = action.payload;
      if (action.payload) {
        state.lobbyStatus = "connected";
        state.lobbyWaking = false;
      }
    },
    setLobbyStatus: (state, action: PayloadAction<{ status: LobbyStatus; attempt?: number }>) => {
      state.lobbyStatus = action.payload.status;
      if (action.payload.attempt !== undefined) state.lobbyAttempt = action.payload.attempt;
    },
    setLobbyWaking: (state, action: PayloadAction<boolean>) => {
      state.lobbyWaking = action.payload;
    },
    setReconnecting: (state, action: PayloadAction<boolean>) => {
      state.reconnecting = action.payload;
    },
    setAvailableRoom: (state, action: PayloadAction<RoomAvailable[]>) => {
      state.availableRooms = action.payload.filter((room) => isCustomRoom(room.name));
    },
    setTotalClients(state, action: PayloadAction<number>) {
      state.totalClients = action.payload;
    },
    addAvailableRoom: (state, action: PayloadAction<RoomAvailable>) => {
      if (!isCustomRoom(action.payload.name)) return;

      const roomIndex = state.availableRooms.findIndex(
        ({ roomId }) => roomId === action.payload.roomId,
      );
      if (roomIndex === -1) {
        state.availableRooms.push(action.payload);
      } else {
        state.availableRooms[roomIndex] = action.payload;
      }
    },
    removeAvailableRoom: (state, action: PayloadAction<string>) => {
      state.availableRooms = state.availableRooms.filter(
        (rooms) => rooms.roomId !== action.payload,
      );
    },
    setJoinedRoomData: (
      state,
      action: PayloadAction<{
        id: string;
        name: string;
        description: string;
        roomType: RoomType;
      }>,
    ) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.description = action.payload.description;
      state.roomType = action.payload.roomType;
    },
  },
});

export const {
  setLobbyJoined,
  setLobbyStatus,
  setLobbyWaking,
  setReconnecting,
  setJoinedRoomData,
  setAvailableRoom,
  addAvailableRoom,
  removeAvailableRoom,
  setTotalClients,
} = roomSlice.actions;
export default roomSlice.reducer;
