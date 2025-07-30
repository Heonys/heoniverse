import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RoomAvailable } from "colyseus.js";

const roomSlice = createSlice({
  name: "room",
  initialState: {
    lobbyJoined: false,
    roomJoined: false,
    id: "",
    name: "",
    description: "",
    availableRooms: [] as RoomAvailable[],
  },
  reducers: {
    setLobbyJoined: (state, action: PayloadAction<boolean>) => {
      state.lobbyJoined = action.payload;
    },
    setRoomJoined: (state, action: PayloadAction<boolean>) => {
      state.roomJoined = action.payload;
    },
    setAvailableRoom: (state, action: PayloadAction<RoomAvailable[]>) => {
      state.availableRooms = action.payload;
    },
    addAvailableRoom: (state, action: PayloadAction<RoomAvailable>) => {
      const exists = state.availableRooms.find(({ roomId }) => roomId === action.payload.roomId);
      if (!exists) {
        state.availableRooms.push(action.payload);
      }
    },
    removeAvailableRoom: (state, action: PayloadAction<string>) => {
      state.availableRooms = state.availableRooms.filter(
        (rooms) => rooms.roomId !== action.payload,
      );
    },
    setJoinedRoomData: (
      state,
      action: PayloadAction<{ id: string; name: string; description: string }>,
    ) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.description = action.payload.description;
    },
  },
});

export const {
  setLobbyJoined,
  setRoomJoined,
  setJoinedRoomData,
  setAvailableRoom,
  addAvailableRoom,
  removeAvailableRoom,
} = roomSlice.actions;
export default roomSlice.reducer;
