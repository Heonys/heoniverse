import { IChatMessage } from "@heoniverse/shared";

/**
 * AI 응답 seam — 지금은 목(mock) 응답을 반환한다.
 * 나중에 이 함수 본문만 실제 LLM 호출로 교체하면 됨.
 * (클라이언트에 API 키를 직접 두면 노출되므로 실배포 시엔 서버 프록시 권장,
 *  예: fetch(import.meta.env.VITE_AI_ENDPOINT, { body: JSON.stringify(messages) }))
 */

const CANNED: { match: RegExp; replies: string[] }[] = [
  {
    match: /안녕|하이|반가|hello|hi\b/i,
    replies: ["안녕하세요! 무엇을 도와드릴까요?", "반가워요 👋 궁금한 거 있으면 물어보세요."],
  },
  {
    match: /이름|누구|who/i,
    replies: ["저는 이 공간의 AI 도우미예요.", "Heoniverse를 안내하는 AI 어시스턴트랍니다."],
  },
  {
    match: /뭐해|기능|할 ?수|무엇|어떻게/i,
    replies: [
      "채팅·화면공유·화이트보드·근접 영상통화 같은 걸 여기서 할 수 있어요.",
      "돌아다니다 컴퓨터나 화이트보드에 R로 상호작용해보세요!",
    ],
  },
  {
    match: /고마|감사|thank/i,
    replies: ["천만에요 😊", "도움이 됐다니 기뻐요!"],
  },
];

const DEFAULT = [
  "그렇군요! (지금은 데모용 목 응답이에요)",
  "재밌네요 🙂 아직은 목업 응답 중이라, 곧 진짜 AI가 답할 거예요.",
  "말씀 잘 들었어요. 더 궁금한 거 있으세요?",
  "여기 돌아다니면서 이것저것 눌러보세요!",
];

const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

export async function getAIResponse(messages: IChatMessage[]): Promise<string> {
  const last = messages[messages.length - 1]?.content ?? "";
  // 실제 API 지연처럼 보이게 약간의 딜레이
  await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 700));
  const hit = CANNED.find((c) => c.match.test(last));
  return pick(hit ? hit.replies : DEFAULT);
}
