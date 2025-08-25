import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Pages = "home" | "messages" | "contacts" | "dialing";

const phoneSlice = createSlice({
  name: "phone",
  initialState: {
    showIphone: false,
    currentPage: "home" as Pages,
    isRinging: false,
    contactName: "Unknown",
  },
  reducers: {
    setShowIphone: (state, action: PayloadAction<boolean>) => {
      state.showIphone = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<Pages>) => {
      state.currentPage = action.payload;
    },
    setIsRinging(state, action: PayloadAction<boolean>) {
      state.isRinging = action.payload;
    },
    setContactName(state, action: PayloadAction<string>) {
      state.contactName = action.payload;
    },
  },
});

export const { setShowIphone, setCurrentPage, setIsRinging, setContactName } = phoneSlice.actions;
export default phoneSlice.reducer;
