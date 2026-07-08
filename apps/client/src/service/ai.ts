import { IChatMessage } from "@heoniverse/shared";

/**
 * AI 응답 seam — 서버 프록시(/api/npc-chat)를 거쳐 Gemini에 질의한다.
 * API 키는 서버(apps/server/.env의 GEMINI_API_KEY)에만 두고, 클라이언트는 프록시만 호출한다.
 */

// dev는 로컬 서버로 하드코딩, prod는 env로 주입 (Network.ts의 서버 주소 패턴과 동일)
const endpoint = import.meta.env.PROD
  ? import.meta.env.VITE_AI_ENDPOINT
  : "http://localhost:2567/api/npc-chat";

// 네트워크·서버 오류 시 NPC가 멈춘 것처럼 보이지 않게 하는 폴백 문구
const FALLBACK = [
  "지금은 대답이 조금 어렵네요. 잠시 뒤에 다시 말 걸어줄래요?",
  "앗, 잠깐 연결이 불안정해요. 이따 다시 물어봐 주세요!",
];

const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

export async function getAIResponse(messages: IChatMessage[]): Promise<string> {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });
    if (!res.ok) throw new Error(`npc-chat ${res.status}`);
    const data = (await res.json()) as { reply?: string };
    return data.reply?.trim() || pick(FALLBACK);
  } catch (err) {
    console.error("[ai] NPC 응답 요청 실패:", err);
    return pick(FALLBACK);
  }
}
