import { phaserGame } from "@/game";
import { Game } from "@/game/scenes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ComputerState = {
  isOpenDialog: boolean;
  whiteboardId: null | string;
};

const initialState: ComputerState = {
  isOpenDialog: true,
  whiteboardId: null,
};

const whiteboardSlice = createSlice({
  name: "whiteboard",
  initialState,
  reducers: {
    openWhiteboardDialog: (state, action: PayloadAction<{ id: string }>) => {
      state.isOpenDialog = true;
      state.whiteboardId = action.payload.id;
      const game = phaserGame.scene.keys.game as Game;
      game.disableKeys();
    },
    closeWhiteboardDialog: (state) => {
      state.isOpenDialog = false;
      const game = phaserGame.scene.keys.game as Game;
      game.enableKeys();
    },
  },
});

export const { openWhiteboardDialog, closeWhiteboardDialog } = whiteboardSlice.actions;
export default whiteboardSlice.reducer;
