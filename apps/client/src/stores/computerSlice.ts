import { phaserGame } from "@/game";
import { Game } from "@/game/scenes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppThunk } from "@/stores";

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
    setComputerDialogOpen: (state, action: PayloadAction<{ id: string }>) => {
      state.isOpenDialog = true;
      state.computerId = action.payload.id;
    },
    setComputerDialogClosed: (state) => {
      state.isOpenDialog = false;
      state.computerId = null;
    },
    setSharing(
      state,
      action: PayloadAction<{ computerId: string; sharingUserId: string; isSharing: boolean }>,
    ) {
      state.sharing[action.payload.computerId] = action.payload;
    },
    setJoinedSharing(state, action: PayloadAction<boolean>) {
      state.joinedSharing = action.payload;
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

const { setComputerDialogOpen, setComputerDialogClosed } = computerSlice.actions;

// 네트워크 호출/키 제어 같은 사이드이펙트는 리듀서가 아닌 thunk에서 수행한다
export const openComputerDialog =
  (payload: { id: string }): AppThunk =>
  (dispatch) => {
    const game = phaserGame.scene.keys.game as Game;
    game.network.connectToComputer(payload.id, true);
    game.disableKeys();
    dispatch(setComputerDialogOpen(payload));
  };

export const closeComputerDialog = (): AppThunk => (dispatch, getState) => {
  const { computerId } = getState().computer;
  const game = phaserGame.scene.keys.game as Game;
  if (computerId) game.network.connectToComputer(computerId, false);
  game.enableKeys();
  dispatch(setComputerDialogClosed());
};

export const { setSharing, setJoinedSharing } = computerSlice.actions;
export const { currentSharing } = computerSlice.selectors;
export default computerSlice.reducer;
