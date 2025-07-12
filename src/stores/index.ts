import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import roomReducer from "./roomSlice";
import computerReducer from "./computerSlice";
import whiteboardSlice from "./whiteboardSlice";
import chatSlice from "./chatSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    room: roomReducer,
    computer: computerReducer,
    whitebaord: whiteboardSlice,
    chat: chatSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
