import { RoomType } from "@heoniverse/shared";

// 새로고침·순단 후 같은 방·같은 위치로 자동 복귀하기 위해 필요한 최소 정보.
// sessionStorage라 탭을 닫으면 사라지고 다른 탭엔 공유되지 않는다(의도된 동작).
export type ReconnectSession = {
  reconnectionToken: string;
  roomId: string;
  roomName: string;
  description: string;
  roomType: RoomType;
  nickname: string;
  avatar: string;
  x: number;
  y: number;
};

// 씬 복원에 필요한 프로필/좌표만 추린 것 (launchGame → Game.create로 전달)
export type RestoreData = Pick<ReconnectSession, "x" | "y" | "avatar" | "nickname">;

const SESSION_KEY = "heoniverse:reconnect";

export function saveSession(session: ReconnectSession) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // 저장 공간 부족·프라이빗 모드 등 — 재접속만 못 할 뿐 치명적이지 않다
  }
}

export function loadSession(): ReconnectSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as ReconnectSession) : null;
  } catch {
    return null;
  }
}

// 이미 저장된 세션이 있을 때만 일부 필드를 갱신한다(없으면 no-op).
// beforeunload에서 최신 토큰·좌표를 병합할 때 사용 — 로그인 전이면 저장 자체가 없다.
export function updateSession(patch: Partial<ReconnectSession>) {
  const current = loadSession();
  if (!current) return;
  saveSession({ ...current, ...patch });
}

export function clearSession() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
}
