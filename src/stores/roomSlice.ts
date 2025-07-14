import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const roomSlice = createSlice({
  name: "room",
  initialState: {
    joined: false,
    id: "",
    name: "",
    description: "",
  },
  reducers: {
    setRoomJoined: (state, action: PayloadAction<boolean>) => {
      state.joined = action.payload;
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

export const { setRoomJoined, setJoinedRoomData } = roomSlice.actions;
export default roomSlice.reducer;
