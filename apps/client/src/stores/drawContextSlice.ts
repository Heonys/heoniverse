import { Actions, Tools } from "@/constants/drawing";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type drawContextState = {
  action: Actions;
  tool: Tools;
};

const initialState: drawContextState = {
  action: Actions.None,
  tool: Tools.Panning,
};

const drawContextSlice = createSlice({
  name: "drawContext",
  initialState,
  reducers: {
    changeAction: (state, action: PayloadAction<Actions>) => {
      state.action = action.payload;
    },
    changeTool: (state, action: PayloadAction<Tools>) => {
      state.tool = action.payload;
    },
  },
});

export const { changeAction, changeTool } = drawContextSlice.actions;
export default drawContextSlice.reducer;
