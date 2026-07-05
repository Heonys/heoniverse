import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch, useGame } from "@/hooks";
import { endNpcTalk } from "@/stores/aiSlice";

type FormType = { message: string };

// AI NPC 전용 입력바 — 하단 중앙. 대화 내용은 인월드 말풍선으로만 표시된다(히스토리 패널 없음).
// 열려 있는 동안 이동키는 잠겨 있고, Esc / ✕ 로 종료한다.
export const NpcChatBar = () => {
  const dispatch = useAppDispatch();
  const { gameScene } = useGame();
  const { register, handleSubmit, reset, setFocus } = useForm<FormType>();

  useEffect(() => {
    setFocus("message");
  }, [setFocus]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dispatch(endNpcTalk());
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dispatch]);

  const onSubmit = ({ message }: FormType) => {
    const text = message.trim();
    reset();
    if (!text) return;
    gameScene.sendToNpc(text);
    setFocus("message");
  };

  return (
    <div className="fixed bottom-24 left-1/2 z-[60] w-[420px] max-w-[92vw] -translate-x-1/2 select-none">
      <div className="mb-1.5 text-center text-xs text-white/90 [text-shadow:_0_1px_2px_rgb(0_0_0/70%)]">
        AI 도우미와 대화 중 · Esc로 종료
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-1.5 rounded-2xl bg-[#323338] p-1.5 shadow-xl ring-1 ring-white/10"
      >
        <input
          type="text"
          autoComplete="off"
          placeholder="메시지를 입력하세요"
          className="w-full flex-1 rounded-xl border-2 border-white/10 bg-[#3d3f45] px-3 py-1.5 text-sm text-white placeholder-gray-400 outline-0"
          {...register("message")}
        />
        <button
          type="button"
          onClick={() => dispatch(endNpcTalk())}
          className="flex size-8 shrink-0 items-center justify-center rounded-xl text-lg text-white/60 hover:bg-white/10 hover:text-white"
          aria-label="대화 종료"
        >
          ✕
        </button>
      </form>
    </div>
  );
};
