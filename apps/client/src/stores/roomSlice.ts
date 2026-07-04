import { RoomAvailable } from "colyseus.js";
import { RoomMetadata, RoomType } from "@heoniverse/shared";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isCustomRoom } from "@/utils";

// connecting: 접속 시도 중 (잠든 서버 깨우기 재시도 포함) / failed: 재시도 소진
export type LobbyStatus = "connecting" | "connected" | "failed";

const roomSlice = createSlice({
  name: "room",
  initialState: {
    lobbyJoined: false,
    lobbyStatus: "connecting" as LobbyStatus,
    lobbyAttempt: 0,
    roomJoined: false,
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
      if (action.payload) state.lobbyStatus = "connected";
    },
    setLobbyStatus: (state, action: PayloadAction<{ status: LobbyStatus; attempt?: number }>) => {
      state.lobbyStatus = action.payload.status;
      if (action.payload.attempt !== undefined) state.lobbyAttempt = action.payload.attempt;
    },
    setRoomJoined: (state, action: PayloadAction<boolean>) => {
      state.roomJoined = action.payload;
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
  setRoomJoined,
  setJoinedRoomData,
  setAvailableRoom,
  addAvailableRoom,
  removeAvailableRoom,
  setTotalClients,
} = roomSlice.actions;
export default roomSlice.reducer;
