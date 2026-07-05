import { phaserGame } from "@/game";
import { Game } from "@/game/scenes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppThunk } from "@/stores";

const aiSlice = createSlice({
  name: "ai",
  initialState: {
    // 내가 지금 AI NPC와 대화 세션 중인가 — true면 내 인게임 채팅이 AI로도 라우팅된다
    talking: false,
    // 서버 기준 현재 NPC를 점유한 sessionId ("" = 아무도 안 씀). 타인이면 나는 말을 못 건다.
    npcBusyBy: "",
  },
  reducers: {
    setTalking: (state, action: PayloadAction<boolean>) => {
      state.talking = action.payload;
    },
    setNpcBusyBy: (state, action: PayloadAction<string>) => {
      state.npcBusyBy = action.payload;
    },
  },
});

const { setTalking } = aiSlice.actions;
export const { setNpcBusyBy } = aiSlice.actions;

// NPC 대화 시작/종료. 전용 입력바가 뜨는 동안엔 이동키를 잠근다(입력 중 캐릭터가 안 움직이게 — 모달 패턴).
export const startNpcTalk = (): AppThunk => (dispatch, getState) => {
  if (getState().ai.talking) return;
  const game = phaserGame.scene.keys.game as Game;
  game.network.startNpcTalk();
  game.npcHistory = []; // 새 대화는 히스토리 초기화
  game.disableKeys();
  dispatch(setTalking(true));
};

export const endNpcTalk = (): AppThunk => (dispatch, getState) => {
  if (!getState().ai.talking) return;
  const game = phaserGame.scene.keys.game as Game;
  game.network.endNpcTalk();
  game.enableKeys();
  dispatch(setTalking(false));
};

export default aiSlice.reducer;
