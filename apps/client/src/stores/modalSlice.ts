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
    // Phaser 객체를 스토어에 넣지 않도록 playerId만 저장한다
    showUserProfile(state, action: PayloadAction<{ playerId: string }>) {
      state.modal = {
        state: "open",
        component: modalTemplates["UserProfile"],
        props: { ...action.payload },
      };
    },
  },
});

export const { show, hide, showUserProfile } = modalSlice.actions;
export default modalSlice.reducer;
