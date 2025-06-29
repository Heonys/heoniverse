import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const roomSlice = createSlice({
  name: "room",
  initialState: {
    roomJoined: false,
  },
  reducers: {
    setRoomJoined: (state, action: PayloadAction<boolean>) => {
      state.roomJoined = action.payload;
    },
  },
});

export const { setRoomJoined } = roomSlice.actions;
export default roomSlice.reducer;
