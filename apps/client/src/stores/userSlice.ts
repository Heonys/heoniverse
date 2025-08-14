import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserState = {
  loggedIn: boolean;
  otherPlayersName: Map<string, string>;
  showJoystick: boolean;
  showMinimap: boolean;
  videoConnected: boolean;
};

const initialState: UserState = {
  loggedIn: false,
  otherPlayersName: new Map<string, string>(),
  showJoystick: false,
  showMinimap: false,
  videoConnected: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
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
    setJoystick(state, action: PayloadAction<boolean>) {
      state.showJoystick = action.payload;
    },
    setMinimap(state, action: PayloadAction<boolean>) {
      state.showMinimap = action.payload;
    },
    setViedeoConnected(state, action: PayloadAction<boolean>) {
      state.videoConnected = action.payload;
    },
  },
});

export const {
  setLoggedIn,
  addPlayerName,
  removePlayerName,
  setJoystick,
  setViedeoConnected,
  setMinimap,
} = userSlice.actions;
export default userSlice.reducer;
