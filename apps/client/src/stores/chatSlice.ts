import { IChatMessage, ChatType } from "@heoniverse/shared";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chatMessages: [] as { type: ChatType; message: IChatMessage }[],
    focused: false,
    lastReadAt: 0,
  },
  reducers: {
    setFocusChat(state, action: PayloadAction<boolean>) {
      state.focused = action.payload;
    },
    pushMessage(state, action: PayloadAction<IChatMessage>) {
      state.chatMessages.push({ type: "CHAT", message: action.payload });
    },
    pushJoinedMessage(state, action: PayloadAction<{ id: string; name: string }>) {
      state.chatMessages.push({
        type: "JOINED",
        message: {
          clientId: action.payload.id,
          author: action.payload.name,
          content: "님이 입장하셨습니다",
          createdAt: new Date().getTime(),
        },
      });
    },
    pushLeftMessage(state, action: PayloadAction<{ id: string; name: string }>) {
      state.chatMessages.push({
        type: "LEFT",
        message: {
          clientId: action.payload.id,
          author: action.payload.name,
          content: "님이 퇴장하셨습니다",
          createdAt: new Date().getTime(),
        },
      });
    },
    markAsRead(state) {
      state.lastReadAt = new Date().getTime();
    },
  },
});

export const { setFocusChat, pushMessage, pushJoinedMessage, pushLeftMessage, markAsRead } =
  chatSlice.actions;
export default chatSlice.reducer;
