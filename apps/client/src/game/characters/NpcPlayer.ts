import { OtherPlayer } from "./OtherPlayer";
import type { LocalPlayer } from "./LocalPlayer";
import type { Game } from "@/game/scenes";
import type { WebRTC } from "@/service";

// 맵에 고정 배치되는 AI 봇 캐릭터. 실제 네트워크 플레이어가 아니라
// 위치 동기화/WebRTC 없이 제자리에 있고, 근접 시 R로 대화를 시작한다.
export class NpcPlayer extends OtherPlayer {
  private busyLabel: Phaser.GameObjects.Text;

  constructor(scene: Game, id: string, name: string, x: number, y: number, texture: string) {
    super(scene, id, name, x, y, texture);
    this.isNpc = true;

    // 일반 유저와 확실히 구분 — 초록 상태점을 숨기고 이름 위 'NPC' 뱃지 + 이름 색을 다르게.
    // stroke는 텍스트 높이를 부풀려 정렬이 틀어지므로 쓰지 않고(플레이어와 높이 일치),
    // 뱃지는 상태점이 있던 높이에 배치한다. 말풍선은 뱃지에 안 가리게 위로 띄운다.
    this.statusCircle.setVisible(false);
    this.playerName.setColor("#1d4ed8");
    this.bubbleOffsetY = 20;

    // NPC 답변은 문장이라 길다 — 잘리지 않게 글자 한도만 넉넉히(폭은 기본), 표시시간은 조금만 늘림.
    this.bubbleMaxLength = 200;
    this.bubbleDuration = 5000;

    const badge = scene.add
      .text(0, -this.playerName.height, "NPC", {
        fontFamily: "Retro",
        fontSize: "10px",
        color: "#ffffff",
        backgroundColor: "#2f6bff",
      })
      .setPadding(3, 1, 3, 1)
      .setOrigin(0.5, 0.5);

    // 다른 사람이 대화 중일 때 멀리서도 보이는 "대화 중" 라벨 (기본 숨김)
    this.busyLabel = scene.add
      .text(0, this.playerName.height + 2, "대화 중", {
        fontFamily: "Retro",
        fontSize: "10px",
        color: "#ffd166",
      })
      .setOrigin(0.5, 0)
      .setVisible(false);

    this.playerContainer.add([badge, this.busyLabel]);
  }

  // 다른 사람이 점유 중이면 "대화 중" 라벨을 켠다
  setBusy(occupiedByOther: boolean) {
    this.busyLabel.setVisible(occupiedByOther);
  }

  // NPC는 실제 피어가 아니므로 근접 WebRTC 연결을 시도하지 않는다
  tryConnectWithPeer(_localPlayer: LocalPlayer, _webRTC: WebRTC) {}
}
