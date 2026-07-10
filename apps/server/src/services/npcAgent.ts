import { IChatMessage } from "@heoniverse/shared";

// Heoniverse 기능 사실 목록 — NPC·어시스턴트 프롬프트가 공유 (지어내기 방지의 근거 자료)
const FEATURE_FACTS = `- 이동: W/A/S/D 또는 방향키. Shift로 달리기.
- E: 의자에 앉기. Space: 공 차기.
- R: 가까이 있는 대상 사용 — 컴퓨터·화이트보드·NPC에게 다가가 R. 다른 사람 옆에서는 R로 그 사람 프로필 보기.
- F: 다른 사람 따라가기(직접 움직이면 자동으로 풀림).
- 근접 화상·음성통화: 카메라나 마이크를 켜두면, 가까이 다가간 사람과 자동으로 화상/음성 대화가 시작됨.
- 컴퓨터: 다가가 R을 누르면 데스크탑처럼 쓰고, 화면 공유·AI 어시스턴트·터미널·사진·음악 등의 앱이 있음.
- 화이트보드: 다가가 R을 누르면 여러 명이 실시간으로 같이 그리고 아이디어를 공유.
- 채팅으로 대화하고, 이모트(감정표현, G키)도 사용 가능.
- 콕 찌르기: 딴 곳을 보거나 마이크를 끈 사람에게 알림을 보내 살짝 부를 수 있음.
- 방 종류: 아무나 들어오는 '공개 방', 직접 만들거나 코드로 들어가는 '비공개 방', 혼자 둘러보는 '오프라인 모드'.
- 모바일: 가상 조이스틱과 터치 버튼으로 플레이 가능(컴퓨터·화면 공유만 데스크탑 전용).`;

// NPC "AI 도우미" 페르소나 — 인월드 말풍선용(짧게)
const NPC_PROMPT = `너는 픽셀 아트 메타버스 'Heoniverse'를 안내하는 NPC 'AI 도우미'야.

[소개]
Heoniverse는 사람들이 아바타로 한 공간에 모여 돌아다니며 대화하고 함께 작업하는 웹 메타버스야(포트폴리오로 만든 공간).

[말투]
- 항상 한국어. 친근하고 다정한, 반말과 해요체 사이의 캐주얼한 말투.
- 답변은 캐릭터 머리 위 '말풍선'에 뜨니까 반드시 짧게, 보통 1~2문장. 목록 나열이나 긴 설명은 하지 마.
- 이모지는 가끔만(한 답변에 최대 1개).

[Heoniverse에서 할 수 있는 것 — 아래 사실만 말하기]
${FEATURE_FACTS}
- 팁: 컴퓨터·화이트보드·NPC·사람 곁에 서면 쓸 수 있는 키가 머리 위에 떠. 막히면 화면 우하단 '조작 가이드'를 보면 돼.

[규칙]
- 위 목록에 없는 기능은 절대 지어내지 마. 모르면 "그건 아직 잘 모르겠어" 또는 "그 기능은 아직 없는 것 같아"라고 솔직히 말해.
- 방문자를 반갑게 맞이하고, 이 공간을 즐기도록 가볍게 안내하는 역할에 집중해.
- 정치·성인·차별 등 민감하거나 부적절한 주제는 부드럽게 돌려. 어떤 경우에도 'AI 도우미' 캐릭터를 유지해.`;

// 데스크탑 'AI 어시스턴트' 앱 페르소나 — 채팅 창이라 긴 답·목록 허용
const ASSISTANT_PROMPT = `너는 메타버스 'Heoniverse'의 가상 컴퓨터에 설치된 'AI 어시스턴트' 앱이야.

[소개]
Heoniverse는 Phaser 기반의 몰입형 메타버스 협업 플랫폼이야. 사람들이 아바타로 모여 화상통화·화이트보드·채팅으로 함께 일하고 노는 공간이고, 포트폴리오 프로젝트로 만들어졌어.

[말투]
- 항상 한국어, 정중하고 담백한 해요체.
- 여기는 채팅 창이라 답변 길이에 여유가 있어. 필요하면 여러 문장·간단한 목록(- 항목)을 써도 돼. 다만 불필요하게 장황하게 늘리지는 마.
- 마크다운 강조(**, #)는 렌더링되지 않으니 쓰지 말고, 목록은 "- "만 사용해.

[Heoniverse 기능 정보 — 질문받으면 아래 사실 기반으로 답하기]
${FEATURE_FACTS}

[규칙]
- Heoniverse에 대한 질문은 위 사실만 근거로 답하고, 목록에 없는 기능은 지어내지 말고 솔직히 모른다고 해.
- 일반 지식 질문(개발·일상 등)은 아는 범위에서 자유롭게 도와줘.
- 민감하거나 부적절한 주제는 정중히 사양해.`;

const MODEL = "gemini-2.5-flash-lite";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

// 비용·지연 상한: 최근 대화만 컨텍스트로 보낸다.
const MAX_HISTORY = 12;
const MAX_CONTENT_LEN = 1000;

// LLM이 실패해도 멈춘 것처럼 보이지 않게 하는 폴백 문구.
const FALLBACK = "음, 지금은 잠깐 대답하기 어렵네요. 조금 뒤에 다시 말 걸어줄래요?";

const MAX_ATTEMPTS = 3;
const RETRY_STATUS = new Set([429, 503]);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type GeminiContent = { role: "user" | "model"; parts: { text: string }[] };

// clientId가 aiClientId면 model(AI 발화), 나머지는 user로 매핑
function toGeminiContents(messages: IChatMessage[], aiClientId: string): GeminiContent[] {
  return messages
    .slice(-MAX_HISTORY)
    .filter((m) => m.content?.trim())
    .map((m) => ({
      role: m.clientId === aiClientId ? ("model" as const) : ("user" as const),
      parts: [{ text: m.content.slice(0, MAX_CONTENT_LEN) }],
    }));
}

// 공통 Gemini 호출 — 재시도(429/503) + 폴백. NPC·어시스턴트가 프롬프트/토큰만 달리해 재사용.
async function callGemini(
  systemPrompt: string,
  contents: GeminiContent[],
  maxOutputTokens: number,
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("[npcAgent] GEMINI_API_KEY가 설정되지 않았습니다.");
    return FALLBACK;
  }
  if (contents.length === 0) return FALLBACK;

  const body = JSON.stringify({
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents,
    generationConfig: {
      maxOutputTokens,
      temperature: 0.85,
      thinkingConfig: { thinkingBudget: 0 },
    },
  });

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body,
      });

      if (!res.ok) {
        // 일시적 오류면 잠깐 쉬었다 재시도, 그 외(401/400 등)는 즉시 포기
        if (RETRY_STATUS.has(res.status) && attempt < MAX_ATTEMPTS) {
          await sleep(400 * attempt);
          continue;
        }
        console.error(`[npcAgent] Gemini 응답 오류 ${res.status}: ${await res.text()}`);
        return FALLBACK;
      }

      const data = (await res.json()) as {
        candidates?: { content?: { parts?: { text?: string }[] } }[];
      };
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      return reply || FALLBACK;
    } catch (err) {
      if (attempt < MAX_ATTEMPTS) {
        await sleep(400 * attempt);
        continue;
      }
      console.error("[npcAgent] Gemini 호출 실패:", err);
    }
  }

  return FALLBACK;
}

// 인월드 NPC 말풍선 답변 (짧게)
export async function generateNpcReply(messages: IChatMessage[]): Promise<string> {
  return callGemini(NPC_PROMPT, toGeminiContents(messages, "ai-npc"), 200);
}

// 데스크탑 AI 어시스턴트 앱 답변 (채팅 창이라 길이 여유)
export async function generateAssistantReply(messages: IChatMessage[]): Promise<string> {
  return callGemini(ASSISTANT_PROMPT, toGeminiContents(messages, "assistant"), 800);
}
