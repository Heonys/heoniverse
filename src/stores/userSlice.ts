import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    loggedIn: false,
    otherPlayersName: new Map<string, string>(),
  },
  reducers: {
    setLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.loggedIn = action.payload;
    },
    addPlayerName(state, action: PayloadAction<{ id: string; name: string }>) {
      state.otherPlayersName.set(action.payload.id, action.payload.name);
    },
    removePlayerName(state, action: PayloadAction<string>) {
      state.otherPlayersName.delete(action.payload);
    },
  },
});

export const { setLoggedIn, addPlayerName, removePlayerName } = userSlice.actions;
export default userSlice.reducer;
