import { RoomAvailable } from "colyseus.js";
import { RoomMetadata, RoomType } from "@heoniverse/shared";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isCustomRoom } from "@/utils";

const roomSlice = createSlice({
  name: "room",
  initialState: {
    lobbyJoined: false,
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
  setRoomJoined,
  setJoinedRoomData,
  setAvailableRoom,
  addAvailableRoom,
  removeAvailableRoom,
  setTotalClients,
} = roomSlice.actions;
export default roomSlice.reducer;
