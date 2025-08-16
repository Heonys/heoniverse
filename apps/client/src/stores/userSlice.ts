import { Status } from "@heoniverse/shared";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserState = {
  texture: string;
  userName: string;
  loggedIn: boolean;
  otherPlayersName: Map<string, string>;
  showJoystick: boolean;
  showMinimap: boolean;
  videoConnected: boolean;
  micConnected: boolean;
  status: Status;
};

const initialState: UserState = {
  texture: "adam",
  userName: "",
  loggedIn: false,
  otherPlayersName: new Map<string, string>(),
  showJoystick: false,
  showMinimap: false,
  videoConnected: false,
  micConnected: false,
  status: "online",
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
    setViedeoConnected(state, action: PayloadAction<boolean>) {
      state.videoConnected = action.payload;
    },
    setMicConnected(state, action: PayloadAction<boolean>) {
      state.micConnected = action.payload;
    },
    setUserStatus(state, action: PayloadAction<Status>) {
      state.status = action.payload;
    },
  },
  selectors: {
    nextStatus: (state) => {
      const statuses: Status[] = ["online", "busy", "dnd"];
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
  setViedeoConnected,
  setMicConnected,
  setMinimap,
  setUserStatus,
  setUserName,
  setUserTexture,
} = userSlice.actions;
export const { nextStatus } = userSlice.selectors;
export default userSlice.reducer;
