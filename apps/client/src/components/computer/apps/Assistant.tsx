import { useEffect, useRef, useState } from "react";
import { IChatMessage } from "@heoniverse/shared";
import { TrafficLights } from "@/components/computer";
import { getAssistantResponse } from "@/service/ai";
import { useGame } from "@/hooks";
import { AppIcon } from "@/icons";
import { cn } from "@/utils";

const GREETING: IChatMessage = {
  clientId: "assistant",
  author: "AI 어시스턴트",
  content:
    "안녕하세요, Heoniverse AI 어시스턴트입니다.\n이 공간의 기능이나 궁금한 것들을 편하게 물어보세요.",
  createdAt: 0,
};

// 응답은 서버 Gemini 프록시(/api/assistant-chat)에서 온다
export const Assistant = () => {
  const { getLocalPlayer } = useGame();
  const [messages, setMessages] = useState<IChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // scrollIntoView는 창(overflow-hidden) 등 조상까지 스크롤시켜 창 내용이 밀린다 — 목록만 스크롤
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, pending]);

  const send = async () => {
    const content = input.trim();
    if (!content || pending) return;
    setInput("");

    const localPlayer = getLocalPlayer();
    const next: IChatMessage[] = [
      ...messages,
      {
        clientId: localPlayer.playerId,
        author: localPlayer.playerName.text,
        content,
        createdAt: Date.now(),
      },
    ];
    setMessages(next);
    setPending(true);

    const reply = await getAssistantResponse(next);
    setMessages((prev) => [
      ...prev,
      { clientId: "assistant", author: "AI 어시스턴트", content: reply, createdAt: Date.now() },
    ]);
    setPending(false);
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl bg-[#1e1e1e]">
      <div className="draggable-area relative flex h-7 w-full flex-none cursor-move items-center justify-center">
        <TrafficLights id="assistant" />
        <span className="text-[12px] text-white/50">AI 어시스턴트</span>
      </div>

      {/* messages */}
      <div ref={listRef} className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 pb-3 pt-5">
        {messages.map((message, i) =>
          message.clientId === "assistant" ? (
            <div key={i} className="flex items-start gap-2.5">
              <div className="grid size-7 flex-none place-items-center rounded-lg bg-gradient-to-br from-[#6d6ff0] via-[#9a5bf0] to-[#d05bd0] text-[13px] text-white">
                ✳
              </div>
              <div className="max-w-[82%] whitespace-pre-wrap rounded-2xl rounded-tl-md bg-white/[0.07] px-3.5 py-2 text-[13px] leading-relaxed text-[#e8eaf0]">
                {message.content}
              </div>
            </div>
          ) : (
            <div key={i} className="flex justify-end">
              <div className="bg-accent max-w-[75%] whitespace-pre-wrap rounded-2xl rounded-br-md px-3.5 py-2 text-[13px] leading-relaxed text-white">
                {message.content}
              </div>
            </div>
          ),
        )}
        {pending && (
          <div className="flex items-start gap-2.5">
            <div className="grid size-7 flex-none place-items-center rounded-lg bg-gradient-to-br from-[#6d6ff0] via-[#9a5bf0] to-[#d05bd0] text-[13px] text-white">
              ✳
            </div>
            <div className="flex gap-1 rounded-2xl rounded-tl-md bg-white/[0.07] px-3.5 py-3">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="size-1.5 animate-pulse rounded-full bg-white/50"
                  style={{ animationDelay: `${i * 0.18}s` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* input */}
      <form
        className="flex flex-none gap-2 border-t border-white/[0.07] px-3 py-2.5"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <input
          type="text"
          value={input}
          autoComplete="off"
          placeholder="무엇이든 물어보세요"
          className="focus:border-accent w-full flex-1 rounded-xl border-[1.5px] border-white/10 bg-[#2a2a2e] px-3.5 py-2 text-[13px] text-white placeholder-gray-500 outline-0 transition-colors"
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          disabled={pending || !input.trim()}
          className={cn(
            "bg-accent grid w-10 flex-none cursor-pointer place-items-center rounded-xl text-white transition",
            (pending || !input.trim()) && "cursor-not-allowed opacity-40",
          )}
          aria-label="전송"
        >
          <AppIcon iconName="arrow-right" size={14} />
        </button>
      </form>
    </div>
  );
};
