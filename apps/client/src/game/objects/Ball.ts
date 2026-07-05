import { Network } from "@/service";

// 공 물리·동기화 튜닝 상수
export const BALL_RADIUS = 11; // 텍스처 크기(2R)와 물리 body 반지름이 이 값을 공유
const BOUNCE = 0.6;
const DRAG = 0.35; // setDamping(true)과 함께 — 1에 가까울수록 덜 감속
const REST_SPEED = 6; // 이 속도 아래면 멈춘 것으로 간주
const SEND_INTERVAL_MS = 50; // 주인이 위치를 스트리밍하는 주기(서버 patch rate와 동일)
const REMOTE_LERP = 0.35; // 비주인 보간 계수 — 서버 위치로 얼마나 빨리 따라붙는지
const ROLL_SCALE = 0.6; // 구르는 회전량(1=물리적으로 정확, 낮출수록 천천히 돎)

// 공유 물리 공. "소유권 이전" 모델:
//  - OWNED: 내가 arcade 물리로 시뮬레이션(진짜 벽 충돌)하고 위치를 서버로 스트리밍한다.
//  - REMOTE: 다른 사람이 주인 → 서버가 보내주는 위치로 부드럽게 보간만 한다.
export class Ball extends Phaser.Physics.Arcade.Sprite {
  private network: Network;
  private localSessionId: string;
  private owned = false;
  private destination: { x: number; y: number };
  private shadow: Phaser.GameObjects.Ellipse; // 바닥 접지 그림자 (공을 따라다님)
  private prevX: number; // 직전 프레임 위치 — 이동량으로 굴리는 회전 계산
  private prevY: number;
  private sendAccum = 0;
  private lastSent = { x: 0, y: 0 };
  private restSent = false; // 멈춘 뒤 최종 위치를 한 번만 보내기 위한 플래그

  constructor(scene: Phaser.Scene, network: Network, localSessionId: string, x: number, y: number) {
    super(scene, x, y, "ball");
    this.network = network;
    this.localSessionId = localSessionId;
    this.destination = { x, y };
    this.prevX = x;
    this.prevY = y;

    this.shadow = scene.add.ellipse(
      x,
      y + BALL_RADIUS * 0.8,
      BALL_RADIUS * 1.7,
      BALL_RADIUS * 0.85,
      0x000000,
      0.18,
    );
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCircle(BALL_RADIUS);
    this.setBounce(BOUNCE);
    this.setDamping(true);
    this.setDrag(DRAG);
    this.setCollideWorldBounds(true);
    this.setDepth(y);
  }

  // 오프라인(서버 없음) 모드 — 동기화가 없으니 항상 내가 물리를 돌리는 로컬 장난감으로 둔다.
  becomeLocalToy() {
    this.owned = true;
  }

  // 내가 공을 찼다 — 즉시 소유권을 낙관적으로 확보하고 임펄스 적용(서버 확정은 KICK_BALL 응답으로).
  kick(vx: number, vy: number) {
    this.owned = true;
    this.restSent = false;
    (this.body as Phaser.Physics.Arcade.Body).setVelocity(vx, vy);
  }

  // 서버 상태(위치·주인) 반영. 내가 주인이면 서버 위치는 내 에코이므로 무시(되돌림 방지).
  applyServer(x: number, y: number, ownerId: string) {
    if (ownerId === this.localSessionId) {
      this.owned = true;
      return;
    }
    this.owned = false;
    this.destination = { x, y };
  }

  protected preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
    const body = this.body as Phaser.Physics.Arcade.Body;

    if (this.owned) {
      if (body.velocity.length() > REST_SPEED) {
        this.restSent = false;
        this.throttledSend(delta);
      } else if (!this.restSent) {
        // 막 멈춤 — 최종 위치를 한 번 전송(소유권은 유지)
        body.setVelocity(0, 0);
        this.sendPosition();
        this.restSent = true;
      }
    } else {
      // REMOTE: 물리 대신 서버 위치로 보간 (주인이 이미 벽 충돌을 반영한 값)
      if (delta > 500) {
        this.setPosition(this.destination.x, this.destination.y);
      } else {
        this.x = Phaser.Math.Linear(this.x, this.destination.x, REMOTE_LERP);
        this.y = Phaser.Math.Linear(this.y, this.destination.y, REMOTE_LERP);
      }
      body.setVelocity(0, 0);
    }

    this.setDepth(this.y + this.height / 2);
    this.shadow.setPosition(this.x, this.y + BALL_RADIUS * 0.8);
    this.shadow.setDepth(this.depth - 1); // 공 바로 아래에 깔린다

    // 이동한 거리에 비례해 회전 → 굴러가는 연출 (구름: 각도 ≈ 거리 / 반지름).
    // 방향은 지배적인 이동축의 부호로 정해 진행 방향으로 구르는 느낌을 준다.
    const mx = this.x - this.prevX;
    const my = this.y - this.prevY;
    const rolled = Math.hypot(mx, my);
    if (rolled > 0.05) {
      const dir = Math.abs(mx) >= Math.abs(my) ? Math.sign(mx) : Math.sign(my);
      this.rotation += (rolled / BALL_RADIUS) * dir * ROLL_SCALE;
    }
    this.prevX = this.x;
    this.prevY = this.y;
  }

  destroy(fromScene?: boolean) {
    this.shadow?.destroy();
    super.destroy(fromScene);
  }

  private throttledSend(delta: number) {
    this.sendAccum += delta;
    if (this.sendAccum < SEND_INTERVAL_MS) return;
    this.sendAccum = 0;
    if (this.x === this.lastSent.x && this.y === this.lastSent.y) return;
    this.sendPosition();
  }

  private sendPosition() {
    this.lastSent = { x: this.x, y: this.y };
    this.network.sendMessage("UPDATE_BALL", { x: this.x, y: this.y });
  }
}
