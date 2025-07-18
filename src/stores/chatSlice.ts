import { ChatMessage, ChatType } from "@/constants";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    showChat: false,
    chatMessages: [] as { type: ChatType; message: ChatMessage }[],
    focused: false,
  },
  reducers: {
    setShowChat: (state, action: PayloadAction<boolean>) => {
      state.showChat = action.payload;
    },
    setFocusChat(state, action: PayloadAction<boolean>) {
      state.focused = action.payload;
    },
    pushMessage(state, action: PayloadAction<ChatMessage>) {
      state.chatMessages.push({ type: "CHAT", message: action.payload });
    },
    pushJoinedMessage(state, action: PayloadAction<ChatMessage>) {
      state.chatMessages.push({ type: "JOINED", message: action.payload });
    },
    pushLeftMessage(state, action: PayloadAction<ChatMessage>) {
      state.chatMessages.push({ type: "LEFT", message: action.payload });
    },
  },
});

export const { setShowChat, setFocusChat, pushMessage, pushJoinedMessage, pushLeftMessage } =
  chatSlice.actions;
export default chatSlice.reducer;
