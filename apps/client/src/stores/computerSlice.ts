import { phaserGame } from "@/game";
import { Game } from "@/game/scenes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ComputerState = {
  isOpenDialog: boolean;
  computerId: null | string;
};

const initialState: ComputerState = {
  isOpenDialog: false,
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
      game.network.connectToComputer(action.payload.id, true);
      game.disableKeys();
    },
    closeComputerDialog: (state) => {
      state.isOpenDialog = false;
      const game = phaserGame.scene.keys.game as Game;
      game.network.connectToComputer(state.computerId!, false);
      game.enableKeys();
      state.computerId = null;
    },
  },
});

export const { openComputerDialog, closeComputerDialog } = computerSlice.actions;
export default computerSlice.reducer;
