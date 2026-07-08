import { PlayerBehavior } from "@/constants/game";
import { Game } from "@/game/scenes";
import { Status } from "@heoniverse/shared";

export class Player extends Phaser.Physics.Arcade.Sprite {
  playerId: string;
  playerTexture: string;
  playerContainer: Phaser.GameObjects.Container;
  playerBubble: Phaser.GameObjects.Container;
  playerStatusBox: Phaser.GameObjects.Container;
  playerEmote: Phaser.GameObjects.Container;
  playerName: Phaser.GameObjects.Text;
  playerBehavior = PlayerBehavior.IDLE;
  playerMarker: Phaser.GameObjects.Arc;
  playerStatus: Status = "available";
  statusCircle: Phaser.GameObjects.Arc;

  readyToConnect = false;
  mediaConnect = false;
  videoEnabled = true;
  micEnabled = true;
  readyToStream = false;
  isCalling = false;
  isNpc = false;
  // 말풍선을 이름표 위로 얼마나 더 띄울지 (기본 0, NPC는 'AI' 뱃지에 안 가리게 올림)
  protected bubbleOffsetY = 0;
  // 말풍선 표시 설정 — 기본은 일반 채팅용(짧게, 3.5초). NPC 등은 하위 클래스에서 늘린다.
  protected bubbleMaxLength = 50;
  protected bubbleWrapWidth = 165;
  protected bubbleDuration = 3500;
  // '생각 중' 점 애니메이션 트윈 (답 대기 동안)
  private thinkingTweens: Phaser.Tweens.Tween[] = [];

  constructor(
    public scene: Game,
    id: string,
    x: number,
    y: number,
    texture: string,
  ) {
    super(scene, x, y, texture);

    this.playerId = id;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    this.playerTexture = texture;
    this.setDepth(this.y);
    this.anims.play(`${texture}_idle_down`);

    this.playerMarker = this.scene.add.circle(this.x, this.y, 25, 0x00ff00, 1).setDepth(999);
    this.scene.cameras.main.ignore([this.playerMarker]);
    // 말풍선은 이름표 컨테이너의 자식이 아니라 별도 상위 레이어(depth 20000)에 둔다 —
    // 그래야 누구의 말풍선이든 항상 모든 이름표·뱃지 위에 그려진다. 위치는 preUpdate에서 동기화.
    this.playerBubble = this.scene.add.container(this.x, this.y - this.height / 2).setDepth(20000);
    this.playerStatusBox = this.scene.add.container(0, 0).setDepth(9999);
    this.playerEmote = this.scene.add.container(0, 0).setDepth(9999);

    this.playerName = this.scene.add
      .text(0, 0, "")
      .setFontFamily("Retro")
      .setFontSize(12)
      .setColor("#000000")
      .setOrigin(0.5, 0.25);

    this.statusCircle = this.scene.add
      .circle(0, 2, 5, 0x01dca2)
      .setStrokeStyle(1.5, 0x000000, 1)
      .setOrigin(0.5, 0.25)
      .setPosition(0, -this.playerName.height);

    this.playerContainer = this.scene.add
      .container(this.x, this.y - this.height / 2, [
        this.playerName,
        this.statusCircle,
        this.playerStatusBox,
        this.playerEmote,
      ])
      .setDepth(9999);

    this.scene.physics.world.enable(this.playerContainer);

    const collisionScale = [0.5, 0.2];
    const playerContainerBody = this.playerContainer.body as Phaser.Physics.Arcade.Body;
    const spriteBody = this.body as Phaser.Physics.Arcade.Body;

    playerContainerBody
      .setSize(this.width * collisionScale[0], this.height * collisionScale[1])
      .setOffset(-this.width / 4, this.height * (1 - collisionScale[1]));

    spriteBody
      .setSize(this.width * collisionScale[0], this.height * collisionScale[1])
      .setOffset(this.width * (1 - collisionScale[0]) * 0.5, this.height * (1 - collisionScale[1]));
  }

  setupMinimap() {
    if (this.scene.minimap) {
      this.scene.minimap.ignore([this, this.playerContainer, this.playerBubble]);
    }
  }

  // 말풍선은 별도 레이어라, 매 프레임 이름표 컨테이너 위치를 따라가게 동기화한다.
  protected preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
    this.playerBubble.setPosition(this.playerContainer.x, this.playerContainer.y);
  }

  openBubble(message: string) {
    this.closeBubble();

    const filtered =
      message.length <= this.bubbleMaxLength
        ? message
        : message.slice(0, this.bubbleMaxLength).concat("...");

    const innerText = this.scene.add
      .text(0, 0, filtered, { wordWrap: { width: this.bubbleWrapWidth, useAdvancedWrap: true } })
      .setFontFamily("Retro")
      .setFontSize(12)
      .setColor("#000000")
      .setOrigin(0.5);

    innerText.setY(-(innerText.height / 2) - this.playerName.height + 8 - this.bubbleOffsetY);

    const boxWidth = innerText.width + 8;
    const boxHeight = innerText.height + 3;
    const boxX = innerText.x - boxWidth / 2;
    const boxY = innerText.y - boxHeight / 2;

    const box = this.scene.add
      .graphics()
      .fillStyle(0xffffff, 1)
      .fillRoundedRect(boxX, boxY, boxWidth, boxHeight, 3)
      .lineStyle(1.5, 0x000000, 1)
      .strokeRoundedRect(boxX, boxY, boxWidth, boxHeight, 3);

    this.playerBubble.add([box, innerText]);

    this.scene.time.delayedCall(this.bubbleDuration, () => {
      this.closeBubble();
    });
  }

  // 답을 기다리는 동안 점 3개가 통통 튀는 '생각 중' 말풍선. 자동으로 닫히지 않고,
  // 실제 답이 오면 openBubble이(closeBubble 경유) 교체하거나 대화 종료 시 정리된다.
  openThinkingBubble() {
    this.closeBubble();

    const gap = 7;
    const boxWidth = 30;
    const boxHeight = 14;
    const cy = -(boxHeight / 2) - this.playerName.height + 8 - this.bubbleOffsetY;

    const box = this.scene.add
      .graphics()
      .fillStyle(0xffffff, 1)
      .fillRoundedRect(-boxWidth / 2, cy - boxHeight / 2, boxWidth, boxHeight, 5)
      .lineStyle(1.5, 0x000000, 1)
      .strokeRoundedRect(-boxWidth / 2, cy - boxHeight / 2, boxWidth, boxHeight, 5);

    // 점은 가운데 고정, 순서대로 옅어졌다 진해지는 페이드로 '입력 중' 느낌
    const dots = [0, 1, 2].map((i) => {
      const dot = this.scene.add.circle((i - 1) * gap, cy, 2.3, 0x000000);
      dot.setAlpha(0.3);
      return dot;
    });

    this.playerBubble.add([box, ...dots]);

    this.thinkingTweens = dots.map((dot, i) =>
      this.scene.tweens.add({
        targets: dot,
        alpha: 1,
        duration: 420,
        yoyo: true,
        repeat: -1,
        delay: i * 180,
        ease: "Sine.easeInOut",
      }),
    );
  }

  closeBubble() {
    this.thinkingTweens.forEach((t) => t.stop());
    this.thinkingTweens = [];
    this.playerBubble.removeAll(true);
  }

  // 캐릭터 머리 위에 이모지가 팝 하고 떠올라 한동안 머물렀다 천천히 사라짐 (채팅과 무관, 화면 전용)
  showEmote(emote: string) {
    const text = this.scene.add
      .text(0, -this.playerName.height - 6, emote)
      .setFontSize(28)
      .setOrigin(0.5)
      .setScale(0);
    this.playerEmote.add(text);

    // 팝인
    this.scene.tweens.add({
      targets: text,
      scale: 1,
      duration: 220,
      ease: "Back.Out",
    });

    // 약 1초 머문 뒤 위로 떠오르며 페이드아웃
    this.scene.tweens.add({
      targets: text,
      y: text.y - 18,
      alpha: 0,
      delay: 1000,
      duration: 500,
      ease: "Cubic.In",
      onComplete: () => text.destroy(),
    });
  }

  openStatusBox(text: string) {
    const innerText = this.scene.add
      .text(0, 0, text)
      .setFontFamily("Retro")
      .setFontSize(12)
      .setColor("#000000")
      .setOrigin(0.5)
      .setY(this.height / 2 + 5);

    const statusBoxWidth = innerText.width + 4;
    const statusBoxHeight = innerText.height + 2;
    const statusBoxX = innerText.x - statusBoxWidth / 2;
    const statusBoxY = innerText.y - statusBoxHeight / 2;

    const box = this.scene.add
      .graphics()
      .fillStyle(0xffffff, 1)
      .fillRoundedRect(statusBoxX, statusBoxY, statusBoxWidth, statusBoxHeight, 3)
      .lineStyle(1.5, 0x000000, 1)
      .strokeRoundedRect(statusBoxX, statusBoxY, statusBoxWidth, statusBoxHeight, 3);

    this.playerStatusBox.add([box, innerText]);
  }

  closeStatusBox() {
    this.playerStatusBox.removeAll(true);
  }

  setCallingState(payload: boolean) {
    this.isCalling = payload;
    if (payload) {
      this.openStatusBox("통화중...");
    } else {
      this.closeStatusBox();
    }
  }

  setPlayerStatus(status: Status) {
    this.playerStatus = status;
    switch (status) {
      case "available": {
        return this.statusCircle.setFillStyle(0x01dca2);
      }
      case "busy": {
        return this.statusCircle.setFillStyle(0xfbd359);
      }
      case "focused": {
        return this.statusCircle.setFillStyle(0xe25156);
      }
    }
  }
}
