import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type DesktopState = {
  showApps: Record<string, boolean>;
  minApps: Record<string, boolean>;
  maxApps: Record<string, boolean>;
  focusedApp: null | string;
};

const initialState: DesktopState = {
  showApps: {},
  minApps: {},
  maxApps: {},
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
    minApp(state, action: PayloadAction<string>) {
      state.minApps[action.payload] = true;
    },
    maxApp(state, action: PayloadAction<string>) {
      state.maxApps[action.payload] = true;
    },
  },
});

export const { openApp, closeApp, minApp, maxApp } = desktopSlice.actions;
export default desktopSlice.reducer;
