// 클라이언트 메시지 검증용 공용 상수 (서버가 신뢰 경계)
export const PLAYER_NAME_MAX = 20;
export const CHAT_MESSAGE_MAX = 300;
export const ANIM_KEY_MAX = 40;
export const ITEM_ID_PATTERN = /^\d{1,3}$/;
export const ITEM_MAP_MAX = 64;
export const WHITEBOARD_ELEMENTS_MAX = 5000;

// tilemap 크기(2400x1600px) + 오브젝트 오프셋 여유분
export const WORLD_BOUNDS = { minX: -100, maxX: 2500, minY: -100, maxY: 1700 };

// 공유 물리 공의 스폰 좌표 (플레이어 스폰 근처 개활지, 튜닝 가능)
export const BALL_SPAWN = { x: 1600, y: 1200 };

// 이모트 허용 셋 (클라 피커 + 서버 검증 공용)
export const EMOTES = ["👍", "❤️", "😂", "🎉", "👏", "😮"] as const;
