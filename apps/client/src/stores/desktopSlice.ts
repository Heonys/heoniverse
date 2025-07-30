import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type DesktopState = {
  showApps: Record<string, boolean>;
  zIndexMap: Record<string, number>;
  topZIndex: number;
  currentApp: string;
};

const initialState: DesktopState = {
  showApps: {},
  zIndexMap: {},
  topZIndex: 10,
  currentApp: "Finder",
};

const desktopSlice = createSlice({
  name: "desktop",
  initialState,
  reducers: {
    openApp(state, action: PayloadAction<{ id: string; title: string }>) {
      state.showApps[action.payload.id] = true;
      state.currentApp = action.payload.title;
      state.zIndexMap[action.payload.id] = state.topZIndex + 1;
      state.topZIndex++;
    },
    closeApp(state, action: PayloadAction<string>) {
      state.showApps[action.payload] = false;
    },
    shutdownDesktop(state) {
      state.showApps = {};
      state.topZIndex = 10;
      state.currentApp = "Finder";
    },
  },
  selectors: {
    visibleAppCount: (state) => {
      return Object.values(state.showApps).filter(Boolean).length;
    },
  },
});

export const { openApp, closeApp, shutdownDesktop } = desktopSlice.actions;
export const { visibleAppCount } = desktopSlice.selectors;
export default desktopSlice.reducer;
