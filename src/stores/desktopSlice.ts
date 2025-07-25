import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type DesktopState = {
  showApps: Record<string, boolean>;
  focusedApp: null | string;
};

const initialState: DesktopState = {
  showApps: {},
  focusedApp: null,
};

const desktopSlice = createSlice({
  name: "desktop",
  initialState,
  reducers: {
    openApp(state, action: PayloadAction<string>) {
      state.showApps[action.payload] = true;
    },
    closeApp(state, action: PayloadAction<string>) {
      state.showApps[action.payload] = false;
    },
    shutdownDesktop(state) {
      state.showApps = {};
      state.focusedApp = null;
    },
  },
});

export const { openApp, closeApp, shutdownDesktop } = desktopSlice.actions;
export default desktopSlice.reducer;
