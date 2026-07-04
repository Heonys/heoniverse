import { IChatMessage, ChatType } from "@heoniverse/shared";
import { createSelector, createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";

// 서버(PushChatUpdateCommand)와 동일한 상한
const MAX_MESSAGES = 100;

type ChatEntry = { id: string; type: ChatType; message: IChatMessage };
type ChatState = {
  chatMessages: ChatEntry[];
  focused: boolean;
  lastReadAt: number;
};

const initialState: ChatState = {
  chatMessages: [],
  focused: false,
  lastReadAt: 0,
};

const pushEntry = (state: ChatState, entry: ChatEntry) => {
  state.chatMessages.push(entry);
  if (state.chatMessages.length > MAX_MESSAGES) state.chatMessages.shift();
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setFocusChat(state, action: PayloadAction<boolean>) {
      state.focused = action.payload;
    },
    pushMessage(state, action: PayloadAction<IChatMessage>) {
      pushEntry(state, { id: nanoid(), type: "CHAT", message: action.payload });
    },
    pushJoinedMessage(state, action: PayloadAction<{ id: string; name: string }>) {
      pushEntry(state, {
        id: nanoid(),
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
      pushEntry(state, {
        id: nanoid(),
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
  selectors: {
    unreadMessageCount: createSelector(
      [
        (state: ChatState) => state.chatMessages,
        (state: ChatState) => state.lastReadAt,
        (_state: ChatState, localPlayerId: string) => localPlayerId,
      ],
      (chatMessages, lastReadAt, localPlayerId) =>
        chatMessages.filter(
          (it) =>
            it.type === "CHAT" &&
            it.message.clientId !== localPlayerId &&
            it.message.createdAt > lastReadAt,
        ).length,
    ),
  },
});

export const { setFocusChat, pushMessage, pushJoinedMessage, pushLeftMessage, markAsRead } =
  chatSlice.actions;
export const { unreadMessageCount } = chatSlice.selectors;
export default chatSlice.reducer;
