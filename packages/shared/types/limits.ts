// 클라이언트 메시지 검증용 공용 상수 (서버가 신뢰 경계)
export const PLAYER_NAME_MAX = 20;
export const CHAT_MESSAGE_MAX = 300;
export const ANIM_KEY_MAX = 40;
export const ITEM_ID_PATTERN = /^\d{1,3}$/;
export const ITEM_MAP_MAX = 64;
export const WHITEBOARD_ELEMENTS_MAX = 5000;

// 협업 코드 에디터(Yjs) — 업데이트 1건/병합 문서 크기 상한
export const CODE_UPDATE_MAX_BYTES = 256 * 1024;
export const CODE_DOC_MAX_BYTES = 2 * 1024 * 1024;
// 파일 개수·이름 규칙 — Yjs 업데이트는 불투명 바이너리라 서버 검사 불가, 클라 측 강제 (2MB 상한이 서버 안전망)
export const CODE_FILES_MAX = 10;
export const CODE_FILE_NAME_PATTERN = /^[\w-]+\.(ts|tsx|js|jsx|json|css|html|md)$/;

// tilemap 크기(2400x1600px) + 오브젝트 오프셋 여유분
export const WORLD_BOUNDS = { minX: -100, maxX: 2500, minY: -100, maxY: 1700 };

// 공유 물리 공의 스폰 좌표 (플레이어 스폰 근처 개활지, 튜닝 가능)
export const BALL_SPAWN = { x: 1600, y: 1200 };

// 이모트 허용 셋 (클라 피커 + 서버 검증 공용)
export const EMOTES = ["👍", "❤️", "😂", "🎉", "👏", "😮"] as const;

// 콕 찌르기 쿨다운 — 보낸이→대상 쌍 기준 (서버 게이트 + 클라 버튼 비활성 공용)
export const NUDGE_COOLDOWN_MS = 30_000;
