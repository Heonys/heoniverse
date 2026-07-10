import { IChatMessage } from "@heoniverse/shared";

/**
 * AI 응답 seam — 서버 프록시를 거쳐 Gemini에 질의한다.
 * API 키는 서버(apps/server/.env의 GEMINI_API_KEY)에만 두고, 클라이언트는 프록시만 호출한다.
 */

// dev는 로컬 서버로 하드코딩, prod는 env로 주입 (Network.ts의 서버 주소 패턴과 동일)
const API_BASE = import.meta.env.PROD ? import.meta.env.VITE_API_BASE_URL : "http://localhost:2567";

// 네트워크·서버 오류 시 멈춘 것처럼 보이지 않게 하는 폴백 문구
const FALLBACK = [
  "지금은 대답이 조금 어렵네요. 잠시 뒤에 다시 말 걸어줄래요?",
  "앗, 잠깐 연결이 불안정해요. 이따 다시 물어봐 주세요!",
];

const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

async function requestReply(path: string, messages: IChatMessage[]): Promise<string> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });
    if (!res.ok) throw new Error(`${path} ${res.status}`);
    const data = (await res.json()) as { reply?: string };
    return data.reply?.trim() || pick(FALLBACK);
  } catch (err) {
    console.error(`[ai] 응답 요청 실패 (${path}):`, err);
    return pick(FALLBACK);
  }
}

// 인월드 NPC 말풍선 답변
export function getAIResponse(messages: IChatMessage[]): Promise<string> {
  return requestReply("/api/npc-chat", messages);
}

// 가상 컴퓨터의 AI 어시스턴트 앱 답변 (채팅 창용, 긴 답 허용)
export function getAssistantResponse(messages: IChatMessage[]): Promise<string> {
  return requestReply("/api/assistant-chat", messages);
}
