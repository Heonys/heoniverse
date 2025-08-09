import { modalTemplates } from "@/hooks";
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
    showConnectBridge(state) {
      state.modal = {
        state: "open",
        component: modalTemplates["UserProfile"],
      };
    },
  },
});

export const { show, hide, showConnectBridge } = modalSlice.actions;
export default modalSlice.reducer;
