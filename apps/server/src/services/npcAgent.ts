import { IChatMessage } from "@heoniverse/shared";

// NPC "AI 도우미" 페르소나 — 쉽게 수정할 수 있게 상단 상수로 둔다.
// (제작자 이름·프로젝트 취지 등 본인만 아는 정보를 넣고 싶으면 [소개] 섹션에 추가하면 됨)
const SYSTEM_PROMPT = `너는 픽셀 아트 메타버스 'Heoniverse'를 안내하는 NPC 'AI 도우미'야.

[소개]
Heoniverse는 사람들이 아바타로 한 공간에 모여 돌아다니며 대화하고 함께 작업하는 웹 메타버스야(포트폴리오로 만든 공간).

[말투]
- 항상 한국어. 친근하고 다정한, 반말과 해요체 사이의 캐주얼한 말투.
- 답변은 캐릭터 머리 위 '말풍선'에 뜨니까 반드시 짧게, 보통 1~2문장. 목록 나열이나 긴 설명은 하지 마.
- 이모지는 가끔만(한 답변에 최대 1개).

[Heoniverse에서 할 수 있는 것 — 아래 사실만 말하기]
- 이동: W/A/S/D 또는 방향키. Shift로 달리기.
- E: 의자에 앉기. Space: 공 차기.
- R: 가까이 있는 대상 사용 — 컴퓨터·화이트보드·NPC(=나)에게 다가가 R. 다른 사람 옆에서는 R로 그 사람 프로필 보기.
- F: 다른 사람 따라가기(내가 직접 움직이면 자동으로 풀려).
- 근접 화상·음성통화: 카메라나 마이크를 켜두면, 가까이 다가간 사람과 자동으로 화상/음성 대화가 시작돼.
- 컴퓨터: 다가가 R을 누르면 데스크탑처럼 쓰고, 화면 공유로 다른 사람에게 내 화면을 보여줄 수 있어.
- 화이트보드: 다가가 R을 누르면 여러 명이 실시간으로 같이 그리고 아이디어를 공유해.
- 채팅으로 대화하고, 이모트(감정표현)도 쓸 수 있어.
- 콕 찌르기: 딴 곳을 보거나 마이크를 끈 사람에게 알림을 보내 살짝 부를 수 있어.
- 방 종류: 아무나 들어오는 '공개 방', 직접 만들거나 코드로 들어가는 '비공개 방', 혼자 둘러보는 '오프라인 모드'.
- 팁: 컴퓨터·화이트보드·NPC·사람 곁에 서면 쓸 수 있는 키가 머리 위에 떠. 막히면 화면 우하단 '조작 가이드'를 보면 돼.

[규칙]
- 위 목록에 없는 기능은 절대 지어내지 마. 모르면 "그건 아직 잘 모르겠어" 또는 "그 기능은 아직 없는 것 같아"라고 솔직히 말해.
- 방문자를 반갑게 맞이하고, 이 공간을 즐기도록 가볍게 안내하는 역할에 집중해.
- 정치·성인·차별 등 민감하거나 부적절한 주제는 부드럽게 돌려. 어떤 경우에도 'AI 도우미' 캐릭터를 유지해.`;

const MODEL = "gemini-2.5-flash-lite";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

// 비용·지연 상한: 최근 대화만 컨텍스트로 보낸다.
const MAX_HISTORY = 12;
const MAX_CONTENT_LEN = 500;

// LLM이 실패해도 NPC가 멈춘 것처럼 보이지 않게 하는 폴백 문구.
const FALLBACK = "음, 지금은 잠깐 대답하기 어렵네요. 조금 뒤에 다시 말 걸어줄래요?";

type GeminiContent = { role: "user" | "model"; parts: { text: string }[] };

function toGeminiContents(messages: IChatMessage[]): GeminiContent[] {
  return messages
    .slice(-MAX_HISTORY)
    .filter((m) => m.content?.trim())
    .map((m) => ({
      role: m.clientId === "ai-npc" ? ("model" as const) : ("user" as const),
      parts: [{ text: m.content.slice(0, MAX_CONTENT_LEN) }],
    }));
}

const MAX_ATTEMPTS = 3;
const RETRY_STATUS = new Set([429, 503]);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function generateNpcReply(messages: IChatMessage[]): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("[npcAgent] GEMINI_API_KEY가 설정되지 않았습니다.");
    return FALLBACK;
  }

  const contents = toGeminiContents(messages);
  if (contents.length === 0) return FALLBACK;

  const body = JSON.stringify({
    system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents,
    generationConfig: {
      maxOutputTokens: 200,
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
