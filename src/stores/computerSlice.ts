import { phaserGame } from "@/game";
import { Game } from "@/game/scenes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ComputerState = {
  isOpenDialog: boolean;
  computerId: null | string;
};

const initialState: ComputerState = {
  isOpenDialog: true,
  computerId: null,
};

const computerSlice = createSlice({
  name: "computer",
  initialState,
  reducers: {
    openComputerDialog: (state, action: PayloadAction<{ id: string }>) => {
      state.isOpenDialog = true;
      state.computerId = action.payload.id;
      const game = phaserGame.scene.keys.game as Game;
      game.disableKeys();
    },
    closeComputerDialog: (state) => {
      state.isOpenDialog = false;
      const game = phaserGame.scene.keys.game as Game;
      game.enableKeys();
    },
  },
});

export const { openComputerDialog, closeComputerDialog } = computerSlice.actions;
export default computerSlice.reducer;
