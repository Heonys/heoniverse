import { Joystick } from "react-joystick-component";
import { isBrowser } from "react-device-detect";
import { useAppSelector, useGame } from "@/hooks";
import { Condition } from "@/common";
import { angle2Movement } from "@/utils";
import { eventEmitter } from "@/game/events";

export type MovementInput = {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
};

export type JoystickMovement = { isMoving: boolean; movement: MovementInput };

// 모바일 전용 · 양손 분리 배치 — 왼손 이동 스틱 / 오른손 E·R 액션 버튼.
// 아이폰(채팅)이 열리면 어차피 이동하지 않으므로 함께 숨긴다.
export const VirtualJoystick = () => {
  const showJoystick = useAppSelector((state) => state.user.showJoystick);
  const loggedIn = useAppSelector((state) => state.user.loggedIn);
  const showIphone = useAppSelector((state) => state.phone.showIphone);
  const { getLocalPlayer } = useGame();

  return (
    <Condition condition={loggedIn && !isBrowser && showJoystick && !showIphone}>
      {/* 왼손: 이동 스틱 (닫힌 폰 버튼 위쪽) */}
      <div className="fixed bottom-20 left-6 z-10 select-none">
        <div className="relative">
          <Joystick
            size={100}
            baseColor="rgba(23,24,28,0.5)"
            stickColor="#5666d6"
            move={(e) => {
              const rad = Math.atan2(e.y || 0, e.x || 0);
              const deg = (rad * 180) / Math.PI;
              const movement = angle2Movement(deg);
              getLocalPlayer().setJoystickMovement({ isMoving: true, movement });
            }}
            stop={() => {
              getLocalPlayer().setJoystickMovement({
                isMoving: false,
                movement: { left: false, right: false, up: false, down: false },
              });
            }}
          />
          {/* 방향 노치 — 스틱임이 한눈에 읽히게 */}
          <span className="pointer-events-none absolute left-1/2 top-1 -translate-x-1/2 text-[9px] text-white/30">
            ▲
          </span>
          <span className="pointer-events-none absolute bottom-1 left-1/2 -translate-x-1/2 rotate-180 text-[9px] text-white/30">
            ▲
          </span>
          <span className="pointer-events-none absolute left-1 top-1/2 -translate-y-1/2 -rotate-90 text-[9px] text-white/30">
            ▲
          </span>
          <span className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 rotate-90 text-[9px] text-white/30">
            ▲
          </span>
        </div>
      </div>

      {/* 오른손: 액션 클러스터 (E 주 버튼 크게, R 대각선 위) — 헬퍼 버튼 위쪽 */}
      <div className="fixed bottom-20 right-6 z-10 h-[118px] w-[128px] select-none">
        <button
          className="font-retro active:bg-accent absolute bottom-[52px] right-[70px] flex size-[50px] cursor-pointer items-center justify-center rounded-full border-[1.5px] border-white/[0.16] bg-[#17181c]/60 text-sm text-white shadow-[0_8px_18px_-10px_rgba(0,0,0,0.6)] backdrop-blur-sm active:scale-95 active:border-transparent"
          onClick={() => eventEmitter.emit("JOYSTICK_KEY_PRESSED", "keyR")}
        >
          R
        </button>
        <button
          className="font-retro active:bg-accent absolute bottom-0 right-0 flex size-[62px] cursor-pointer items-center justify-center rounded-full border-[1.5px] border-white/[0.16] bg-[#17181c]/60 text-[17px] text-white shadow-[0_8px_18px_-10px_rgba(0,0,0,0.6)] backdrop-blur-sm active:scale-95 active:border-transparent"
          onClick={() => eventEmitter.emit("JOYSTICK_KEY_PRESSED", "keyE")}
        >
          E
        </button>
      </div>
    </Condition>
  );
};
