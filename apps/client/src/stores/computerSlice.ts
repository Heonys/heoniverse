import { phaserGame } from "@/game";
import { Game } from "@/game/scenes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Sharing = Record<string, { sharingUserId: string; isSharing: boolean }>;
type ComputerState = {
  isOpenDialog: boolean;
  computerId: null | string;
  sharing: Sharing;
  joinedSharing: boolean;
};

const initialState: ComputerState = {
  isOpenDialog: false,
  computerId: null,
  sharing: {},
  joinedSharing: false,
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
    setSharing(
      state,
      action: PayloadAction<{ computerId: string; sharingUserId: string; isSharing: boolean }>,
    ) {
      state.sharing[action.payload.computerId] = action.payload;
    },
    setJoinedSharing(state, actoin: PayloadAction<boolean>) {
      state.joinedSharing = actoin.payload;
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

export const { openComputerDialog, closeComputerDialog, setSharing, setJoinedSharing } =
  computerSlice.actions;
export const { currentSharing } = computerSlice.selectors;
export default computerSlice.reducer;
