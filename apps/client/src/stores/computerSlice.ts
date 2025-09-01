import { phaserGame } from "@/game";
import { Game } from "@/game/scenes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Sharing = Record<string, { sharingUserId: string; isSharing: boolean }>;
type ComputerState = {
  isOpenDialog: boolean;
  computerId: null | string;
  sharing: Sharing;
};

const initialState: ComputerState = {
  isOpenDialog: false,
  computerId: null,
  sharing: {},
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
    setSharing(state, action: PayloadAction<{ sharingUserId: string; isSharing: boolean }>) {
      if (state.computerId) {
        state.sharing[state.computerId] = action.payload;
      }
    },
  },
  selectors: {
    currentSharing: (state) => {
      if (
        state.computerId &&
        state.sharing[state.computerId] &&
        state.sharing[state.computerId].isSharing
      ) {
        return state.sharing[state.computerId];
      } else {
        return false;
      }
    },
  },
});

export const { openComputerDialog, closeComputerDialog, setSharing } = computerSlice.actions;
export const { currentSharing } = computerSlice.selectors;
export default computerSlice.reducer;
