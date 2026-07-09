import { useState } from "react";
import { Joystick } from "react-joystick-component";
import { isBrowser } from "react-device-detect";
import { useAppSelector, useGame } from "@/hooks";
import { Condition } from "@/common";
import { angle2Movement, cn } from "@/utils";
import { eventEmitter } from "@/game/events";

export type MovementInput = {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
};

export type JoystickMovement = { isMoving: boolean; movement: MovementInput; sprint: boolean };

// 액션 버튼 공통 룩 — 밝은 원형 + 어두운 텍스트 (주 버튼 R·활성 토글만 호출부에서 인디고로 덮는다)
const actionButtonClass = (...extra: Parameters<typeof cn>) =>
  cn(
    "flex cursor-pointer flex-col items-center justify-center rounded-full",
    "border-2 border-[#14161e]/25 bg-white/90 text-[#23252d]",
    "shadow-[0_4px_12px_rgba(0,0,0,0.3)] active:scale-95",
    ...extra,
  );

// 버튼 하단 소형 라벨
const buttonLabelClass = "text-[8.5px] font-bold leading-tight text-[#6b7080]";

// 모바일 전용 · 양손 분리 배치 — 왼손 이동 스틱(걷기 전용) / 오른손 액션 클러스터.
// 달리기는 스틱이 아니라 토글 버튼(Shift 대체) — 스틱 거리 기반은 항상 끝까지 밀게 돼 구분이 안 됨.
// 채팅 시트가 열리면 어차피 이동하지 않으므로 함께 숨긴다.
export const VirtualJoystick = () => {
  const showJoystick = useAppSelector((state) => state.user.showJoystick);
  const loggedIn = useAppSelector((state) => state.user.loggedIn);
  const showIphone = useAppSelector((state) => state.phone.showIphone);
  const { getLocalPlayer } = useGame();
  const [runActive, setRunActive] = useState(false);

  return (
    <Condition condition={loggedIn && !isBrowser && showJoystick && !showIphone}>
      {/* 왼손: 이동 스틱 — 다크 반투명 베이스 + 흰 노브, 링 테두리 */}
      <div className="fixed bottom-[max(80px,calc(env(safe-area-inset-bottom)+72px))] left-6 z-10 select-none">
        <div className="relative">
          <Joystick
            size={104}
            baseColor="rgba(20,22,30,0.32)"
            stickColor="rgba(255,255,255,0.85)"
            move={(e) => {
              const rad = Math.atan2(e.y || 0, e.x || 0);
              const deg = (rad * 180) / Math.PI;
              const movement = angle2Movement(deg);
              getLocalPlayer().setJoystickMovement({
                isMoving: true,
                movement,
                sprint: runActive,
              });
            }}
            stop={() => {
              getLocalPlayer().setJoystickMovement({
                isMoving: false,
                movement: { left: false, right: false, up: false, down: false },
                sprint: false,
              });
            }}
          />
          <div className="pointer-events-none absolute inset-0 rounded-full border-2 border-white/50" />
        </div>
      </div>

      {/* 오른손: 액션 클러스터 — R(상호작용) 주 버튼, 주변에 E(앉기)·펀치·달리기(토글)·이모지 */}
      <div className="fixed bottom-[max(76px,calc(env(safe-area-inset-bottom)+68px))] right-5 z-10 h-40 w-[160px] select-none">
        <button
          className={actionButtonClass(
            "absolute bottom-[108px] right-[56px] size-12",
            runActive && "bg-accent border-white/40 text-white",
          )}
          aria-pressed={runActive}
          onClick={() => setRunActive((prev) => !prev)}
        >
          <span className="font-retro text-[9px] leading-none">Shift</span>
          <span className={cn(buttonLabelClass, runActive && "text-white/80")}>달리기</span>
        </button>
        <button
          className={actionButtonClass("absolute bottom-[86px] right-0 size-11")}
          aria-label="이모트"
          onClick={() => eventEmitter.emit("TOGGLE_EMOTE_WHEEL")}
        >
          <span className="font-retro text-[13px] leading-none">G</span>
          <span className={buttonLabelClass}>이모지</span>
        </button>
        <button
          className={actionButtonClass("absolute bottom-[58px] right-[92px] size-12")}
          aria-label="펀치"
          onClick={() => eventEmitter.emit("JOYSTICK_KEY_PRESSED", "keySpace")}
        >
          <span className="font-retro text-[9px] leading-none">Space</span>
          <span className={buttonLabelClass}>펀치</span>
        </button>
        <button
          className={actionButtonClass("absolute bottom-0 right-[84px] size-12")}
          onClick={() => eventEmitter.emit("JOYSTICK_KEY_PRESSED", "keyE")}
        >
          <span className="font-retro text-[13px] leading-none">E</span>
          <span className={buttonLabelClass}>앉기</span>
        </button>
        <button
          className={actionButtonClass(
            "bg-accent absolute bottom-0 right-0 size-16 border-white/40 text-white",
          )}
          onClick={() => eventEmitter.emit("JOYSTICK_KEY_PRESSED", "keyR")}
        >
          <span className="font-retro text-[17px] leading-none">R</span>
          <span className={cn(buttonLabelClass, "text-white/80")}>상호작용</span>
        </button>
      </div>
    </Condition>
  );
};
