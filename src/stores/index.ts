import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import roomReducer from "./roomSlice";
import computerReducer from "./computerSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    room: roomReducer,
    computer: computerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
