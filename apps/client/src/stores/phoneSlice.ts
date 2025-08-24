import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Pages = "home" | "messages";

const phoneSlice = createSlice({
  name: "phone",
  initialState: {
    showIphone: false,
    currentPage: "home" as Pages,
  },
  reducers: {
    setShowIphone: (state, action: PayloadAction<boolean>) => {
      state.showIphone = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<Pages>) => {
      state.currentPage = action.payload;
    },
  },
});

export const { setShowIphone, setCurrentPage } = phoneSlice.actions;
export default phoneSlice.reducer;
