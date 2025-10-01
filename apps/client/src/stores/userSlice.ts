import { Status } from "@heoniverse/shared";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserState = {
  texture: string;
  userName: string;
  loggedIn: boolean;
  otherPlayersName: Map<string, string>;
  showJoystick: boolean;
  showMinimap: boolean;
  mediaConnected: boolean;
  videoEnabled: boolean;
  micEnabled: boolean;
  status: Status;
  isAdmin: boolean;
};

const initialState: UserState = {
  texture: "suit",
  userName: "",
  loggedIn: false,
  otherPlayersName: new Map<string, string>(),
  showJoystick: false,
  showMinimap: false,
  mediaConnected: false,
  videoEnabled: true,
  micEnabled: true,
  status: "available",
  isAdmin: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserTexture: (state, action: PayloadAction<string>) => {
      state.texture = action.payload;
    },
    setUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload;
    },
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
    setMediaConnected(state, action: PayloadAction<boolean>) {
      state.mediaConnected = action.payload;
    },
    setViedeoEnabled(state, action: PayloadAction<boolean>) {
      state.videoEnabled = action.payload;
    },
    setMicEnabled(state, action: PayloadAction<boolean>) {
      state.micEnabled = action.payload;
    },
    setUserStatus(state, action: PayloadAction<Status>) {
      state.status = action.payload;
    },
    initMediaState: (state) => {
      state.videoEnabled = true;
      state.micEnabled = true;
    },
    grantAdmin: (state) => {
      state.isAdmin = true;
    },
  },
  selectors: {
    nextStatus: (state) => {
      const statuses: Status[] = ["available", "busy", "focused"];
      const currentIndex = statuses.indexOf(state.status);
      const nextIndex = (currentIndex + 1) % statuses.length;
      return statuses[nextIndex];
    },
  },
});

export const {
  setLoggedIn,
  addPlayerName,
  removePlayerName,
  setJoystick,
  setMediaConnected,
  setViedeoEnabled,
  setMicEnabled,
  setMinimap,
  setUserStatus,
  setUserName,
  setUserTexture,
  initMediaState,
  grantAdmin,
} = userSlice.actions;
export const { nextStatus } = userSlice.selectors;
export default userSlice.reducer;
