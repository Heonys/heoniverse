import { phaserGame } from "@/game";
import { Game } from "@/game/scenes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppThunk } from "@/stores";

type WhiteboardState = {
  isOpenDialog: boolean;
  whiteboardId: null | string;
};

const initialState: WhiteboardState = {
  isOpenDialog: false,
  whiteboardId: null,
};

const whiteboardSlice = createSlice({
  name: "whiteboard",
  initialState,
  reducers: {
    setWhiteboardDialogOpen: (state, action: PayloadAction<{ id: string }>) => {
      state.isOpenDialog = true;
      state.whiteboardId = action.payload.id;
    },
    setWhiteboardDialogClosed: (state) => {
      state.isOpenDialog = false;
    },
  },
});

const { setWhiteboardDialogOpen, setWhiteboardDialogClosed } = whiteboardSlice.actions;

// 네트워크 호출/키 제어 같은 사이드이펙트는 리듀서가 아닌 thunk에서 수행한다
export const openWhiteboardDialog =
  (payload: { id: string }): AppThunk =>
  (dispatch) => {
    const game = phaserGame.scene.keys.game as Game;
    game.network.connectToWhiteboard(payload.id, true);
    game.disableKeys();
    dispatch(setWhiteboardDialogOpen(payload));
  };

export const closeWhiteboardDialog = (): AppThunk => (dispatch, getState) => {
  const { whiteboardId } = getState().whiteboard;
  const game = phaserGame.scene.keys.game as Game;
  if (whiteboardId) game.network.connectToWhiteboard(whiteboardId, false);
  game.enableKeys();
  dispatch(setWhiteboardDialogClosed());
};

export default whiteboardSlice.reducer;
