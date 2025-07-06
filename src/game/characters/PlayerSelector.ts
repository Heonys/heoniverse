import { LocalPlayer } from "@/game/characters";

// 플레이어가 바라보는 방향에 상호작용이 가능한 특정 오브젝트가 존재하는지 감지하는 영역
export class PlayerSelector extends Phaser.GameObjects.Zone {
  constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
    super(scene, x, y, width, height);

    scene.physics.add.existing(this);
  }

  update(player: LocalPlayer, cursor: Phaser.Types.Input.Keyboard.CursorKeys) {
    if (!cursor) return;
  }
}
