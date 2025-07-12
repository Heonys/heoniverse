import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ComputerState = {
  showChat: boolean;
};

const initialState: ComputerState = {
  showChat: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setShowChat: (state, action: PayloadAction<boolean>) => {
      state.showChat = action.payload;
    },
  },
});

export const { setShowChat } = chatSlice.actions;
export default chatSlice.reducer;
