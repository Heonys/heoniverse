import { IChatMessage, ChatType } from "@server/src/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    showChat: true,
    chatMessages: [] as { type: ChatType; message: IChatMessage }[],
    focused: false,
  },
  reducers: {
    setShowChat: (state, action: PayloadAction<boolean>) => {
      state.showChat = action.payload;
    },
    setFocusChat(state, action: PayloadAction<boolean>) {
      state.focused = action.payload;
    },
    pushMessage(state, action: PayloadAction<IChatMessage>) {
      state.chatMessages.push({ type: "CHAT", message: action.payload });
    },
    pushJoinedMessage(state, action: PayloadAction<string>) {
      state.chatMessages.push({
        type: "JOINED",
        message: {
          author: action.payload,
          content: "님이 입장하셨습니다.",
          createdAt: new Date().getTime(),
        },
      });
    },
    pushLeftMessage(state, action: PayloadAction<string>) {
      state.chatMessages.push({
        type: "LEFT",
        message: {
          author: action.payload,
          content: "님이 퇴장하셨습니다.",
          createdAt: new Date().getTime(),
        },
      });
    },
  },
});

export const { setShowChat, setFocusChat, pushMessage, pushJoinedMessage, pushLeftMessage } =
  chatSlice.actions;
export default chatSlice.reducer;
