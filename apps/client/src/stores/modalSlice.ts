import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ModalState =
  | {
      state: "close";
    }
  | {
      state: "open";
      component: React.ComponentType<any>;
      props?: Record<string, any>;
    };

const modalSlice = createSlice({
  name: "modal",
  initialState: {
    modal: { state: "close" } as ModalState,
  },
  reducers: {
    show: (state, action: PayloadAction<ModalState>) => {
      state.modal = action.payload;
    },
    hide: (state) => {
      state.modal = { state: "close" };
    },
  },
});

export const { show, hide } = modalSlice.actions;
export default modalSlice.reducer;
