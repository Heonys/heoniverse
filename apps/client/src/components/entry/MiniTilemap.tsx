import { PropsWithChildren, useLayoutEffect, useRef } from "react";
import { isBrowser } from "react-device-detect";
import { Condition } from "@/common";
import { cn } from "@/utils";

// 인게임 시트(entire/*.png, 1792×1280 · 프레임 32×64)를 1.75배로 그린다
// (0.25 단위 배율이라 프레임 좌표가 정수로 떨어져 픽셀이 안 뭉개진다)
const SC = 1.75;
const VW = 32 * SC;
const VH = 64 * SC;
// 시트에서 방향별 시작 열 (idle 56~79 / run 112~135 프레임 구간의 열 오프셋)
const DIRCOL = { right: 0, up: 6, left: 12, down: 18 } as const;
type Facing = keyof typeof DIRCOL;
const IDLE_ROW = 1;
const RUN_ROW = 2;
const IDLE_FPS = 9;
const RUN_FPS = 15;
// 미니맵용 시각 속도(px/s) — 인게임 200/340을 축소 무대에 맞게 줄인 값
const SPEED = 60 * SC;
const SPRINT = 100 * SC;
// e.code(물리 키)로 판정해야 한글 IME 상태에서도 WASD가 동작한다
const MOVE_CODES = [
  "KeyW",
  "KeyA",
  "KeyS",
  "KeyD",
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ShiftLeft",
  "ShiftRight",
];

type Props = {
  avatar: string;
  nickname: string;
  className?: string;
};

// 조작 가능한 미니 타일맵 — 선택한 캐릭터를 WASD로 직접 움직여 보는 무대.
// Phaser 씬은 join 후에만 뜨므로 DOM + rAF로 걷기/대기 애니메이션을 재현한다.
export const MiniTilemap = ({ avatar, nickname, className }: Props) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const charRef = useRef<HTMLDivElement>(null);
  // 60fps 루프 상태는 전부 ref — state로 두면 매 프레임 리렌더가 난다
  const sim = useRef({
    feetX: 0,
    feetY: 0,
    facing: "down" as Facing,
    frame: 0,
    frameT: 0,
    moving: false,
    last: 0,
    keys: new Set<string>(),
  });

  useLayoutEffect(() => {
    const map = mapRef.current;
    const player = playerRef.current;
    const char = charRef.current;
    if (!map || !player || !char) return;
    const s = sim.current;

    const rect = map.getBoundingClientRect();
    s.feetX = rect.width * 0.5;
    s.feetY = rect.height * 0.74;

    const paint = () => {
      const row = s.moving ? RUN_ROW : IDLE_ROW;
      const col = DIRCOL[s.facing] + s.frame;
      char.style.backgroundPosition = `${-col * VW}px ${-row * VH}px`;
      player.style.left = `${s.feetX - VW * 0.5}px`;
      player.style.top = `${s.feetY - VH}px`;
    };
    paint();

    const onKeyDown = (e: KeyboardEvent) => {
      const active = document.activeElement;
      if (
        active instanceof HTMLElement &&
        (active.tagName === "INPUT" || active.tagName === "TEXTAREA")
      ) {
        return; // 닉네임 등 입력 중엔 이동하지 않는다
      }
      if (MOVE_CODES.includes(e.code)) {
        s.keys.add(e.code);
        e.preventDefault(); // 방향키 스크롤 방지 (이동 키에만 적용)
      }
    };
    const onKeyUp = (e: KeyboardEvent) => s.keys.delete(e.code);
    const onWindowBlur = () => s.keys.clear();
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onWindowBlur);

    let raf = 0;
    const loop = (ts: number) => {
      if (!s.last) s.last = ts;
      let dt = (ts - s.last) / 1000;
      s.last = ts;
      if (dt > 0.05) dt = 0.05;

      const bounds = map.getBoundingClientRect();
      let vx = 0;
      let vy = 0;
      if (s.keys.has("KeyW") || s.keys.has("ArrowUp")) vy -= 1;
      if (s.keys.has("KeyS") || s.keys.has("ArrowDown")) vy += 1;
      if (s.keys.has("KeyA") || s.keys.has("ArrowLeft")) vx -= 1;
      if (s.keys.has("KeyD") || s.keys.has("ArrowRight")) vx += 1;

      const nowMoving = !!(vx || vy);
      if (nowMoving) {
        const len = Math.hypot(vx, vy);
        vx /= len;
        vy /= len;
        const speed = s.keys.has("ShiftLeft") || s.keys.has("ShiftRight") ? SPRINT : SPEED;
        s.feetX += vx * speed * dt;
        s.feetY += vy * speed * dt;
        s.feetX = Math.max(VW * 0.5, Math.min(bounds.width - VW * 0.5, s.feetX));
        // 위로는 네임태그, 아래로는 조작키 오버레이가 잘리지 않게 유지
        s.feetY = Math.max(VH - 14, Math.min(bounds.height - 36, s.feetY));
        if (vx > 0) s.facing = "right";
        else if (vx < 0) s.facing = "left";
        else if (vy > 0) s.facing = "down";
        else s.facing = "up";
      }
      if (nowMoving !== s.moving) {
        s.moving = nowMoving;
        s.frame = 0;
        s.frameT = 0;
      }
      s.frameT += dt;
      const secPerFrame = 1 / (s.moving ? RUN_FPS : IDLE_FPS);
      while (s.frameT >= secPerFrame) {
        s.frameT -= secPerFrame;
        s.frame = (s.frame + 1) % 6;
      }
      paint();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onWindowBlur);
    };
  }, []);

  return (
    <div
      ref={mapRef}
      // 맵을 클릭하면 입력 포커스를 풀어 바로 움직일 수 있게 한다
      onMouseDown={() => {
        const active = document.activeElement;
        if (active instanceof HTMLElement && active.tagName === "INPUT") active.blur();
      }}
      className={cn(
        "relative overflow-hidden rounded-2xl bg-[url('/images/background/menu-floor.png')] bg-repeat shadow-[inset_0_0_0_1px_rgba(0,0,0,0.35),inset_0_0_60px_-12px_rgba(0,0,0,0.45)] [background-size:64px_64px] [image-rendering:pixelated] after:pointer-events-none after:absolute after:inset-0 after:shadow-[inset_0_-40px_60px_-30px_rgba(10,14,26,0.55),inset_0_30px_50px_-30px_rgba(255,255,255,0.06)] after:content-['']",
        className,
      )}
    >
      <div ref={playerRef} className="absolute h-[112px] w-[56px] will-change-[left,top]">
        <div className="absolute bottom-full left-1/2 mb-0.5 flex -translate-x-1/2 items-center gap-[5px] whitespace-nowrap">
          <span className="bg-voice size-2 rounded-full border-[1.5px] border-black" />
          <span className="font-retro text-[13px] tracking-[0.5px] text-black">
            {nickname || "닉네임"}
          </span>
        </div>
        <div
          ref={charRef}
          className="h-[112px] w-[56px] bg-no-repeat [background-size:3136px_2240px] [image-rendering:pixelated]"
          style={{ backgroundImage: `url(/images/character/entire/${avatar}.png)` }}
        />
        <div className="absolute bottom-1.5 left-1/2 -z-10 h-3 w-9 -translate-x-1/2 rounded-full bg-black/30 blur-[4px]" />
      </div>

      {/* 이동/달리기만 안내 — 지금 이 자리에서 실제로 동작하는 키. 나머지는 인게임에서 배운다 */}
      <Condition condition={isBrowser}>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1.5 bg-[linear-gradient(to_top,rgba(10,13,24,0.8),rgba(10,13,24,0.42)_60%,transparent)] px-2 pb-[9px] pt-2">
          <Ctrl keys={["W", "A", "S", "D"]}>이동</Ctrl>
          <Ctrl keys={["Shift"]}>달리기</Ctrl>
        </div>
      </Condition>
    </div>
  );
};

const Ctrl = ({ keys, children }: PropsWithChildren<{ keys: string[] }>) => {
  return (
    <span className="inline-flex items-center gap-[5px] text-[11.5px] text-white/90">
      <span className="inline-flex gap-[3px]">
        {keys.map((key) => (
          <span
            key={key}
            className="inline-grid h-[19px] min-w-[19px] place-items-center rounded-[5px] border border-white/[0.12] bg-[#101115] px-1 text-[10px] font-semibold text-[#d6d8de] shadow-[inset_0_-1px_0_rgba(0,0,0,0.5)]"
          >
            {key}
          </span>
        ))}
      </span>
      {children}
    </span>
  );
};
