import { Status } from "@heoniverse/shared";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserState = {
  texture: string;
  userName: string;
  loggedIn: boolean;
  otherPlayersName: Record<string, string>;
  showJoystick: boolean;
  showMinimap: boolean;
  mediaConnected: boolean;
  videoEnabled: boolean;
  micEnabled: boolean;
  status: Status;
  isAdmin: boolean;
  single: boolean;
  // 지금 따라가는 중인 상대 (null = 안 따라감). HUD 인디케이터용 — 실제 이동 로직은 LocalPlayer.followTargetId
  following: { id: string; name: string } | null;
};

const initialState: UserState = {
  texture: "suit",
  userName: "",
  loggedIn: false,
  otherPlayersName: {},
  // 모바일은 조이스틱이 기본 표시 (헬퍼 토글은 모바일 전용, 데스크탑에선 렌더 자체가 안 됨)
  showJoystick: true,
  showMinimap: false,
  mediaConnected: false,
  videoEnabled: true,
  micEnabled: true,
  status: "available",
  isAdmin: false,
  single: false,
  following: null,
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
      state.otherPlayersName[action.payload.id] = action.payload.name;
    },
    removePlayerName(state, action: PayloadAction<string>) {
      delete state.otherPlayersName[action.payload];
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
    setVideoEnabled(state, action: PayloadAction<boolean>) {
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
    setSingleMode: (state, action: PayloadAction<boolean>) => {
      state.single = action.payload;
    },
    setFollowing: (state, action: PayloadAction<{ id: string; name: string } | null>) => {
      state.following = action.payload;
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
  setVideoEnabled,
  setMicEnabled,
  setMinimap,
  setUserStatus,
  setUserName,
  setUserTexture,
  initMediaState,
  grantAdmin,
  setSingleMode,
  setFollowing,
} = userSlice.actions;
export const { nextStatus } = userSlice.selectors;
export default userSlice.reducer;
