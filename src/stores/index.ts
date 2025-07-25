import { enableMapSet } from "immer";
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import roomReducer from "./roomSlice";
import computerReducer from "./computerSlice";
import whiteboardSlice from "./whiteboardSlice";
import chatSlice from "./chatSlice";
import desktopSlice from "./desktopSlice";

enableMapSet();

export const store = configureStore({
  reducer: {
    user: userReducer,
    room: roomReducer,
    computer: computerReducer,
    whitebaord: whiteboardSlice,
    chat: chatSlice,
    desktop: desktopSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
