import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Pages = "home" | "messages" | "contacts" | "dialing";
type CurrentPage = {
  page: Pages;
  props?: Record<string, any>;
};
type Ringing = { state: false } | { state: true; caller: string };
type Connected = { state: false } | { state: true; startedAt: Date };

type PhoneState = {
  showIphone: boolean;
  currentPage: CurrentPage;
  isRinging: Ringing;
  isConnected: Connected;
};

const initialState: PhoneState = {
  showIphone: false,
  currentPage: { page: "home" },
  isRinging: { state: false },
  isConnected: { state: false },
};

const phoneSlice = createSlice({
  name: "phone",
  initialState,
  reducers: {
    setShowIphone: (state, action: PayloadAction<boolean>) => {
      state.showIphone = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<CurrentPage>) => {
      state.currentPage = action.payload;
    },
    setIsRinging(state, action: PayloadAction<Ringing>) {
      state.isRinging = action.payload;
    },
    setIsConnected(state, action: PayloadAction<Connected>) {
      state.isConnected = action.payload;
    },
  },
});

export const { setShowIphone, setCurrentPage, setIsRinging, setIsConnected } = phoneSlice.actions;
export default phoneSlice.reducer;
