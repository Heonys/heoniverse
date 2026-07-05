import { LocalPlayer, Player, PlayerOverlap } from "@/game/characters";
import { splitAnimKey } from "@/utils";
import { IPlayer } from "@heoniverse/shared";
import { Game } from "@/game/scenes";
import { WebRTC } from "@/service";
import { eventEmitter } from "@/game/events";

// 이 거리(px)에서 볼륨이 0에 수렴 — 근접 연결 반경(약 128px)보다 살짝 크게
const PROXIMITY_AUDIO_RADIUS = 150;

export class OtherPlayer extends Player {
  playerOverlap: PlayerOverlap;
  containerBody: Phaser.Physics.Arcade.Body;
  destination = { x: 0, y: 0 };
  speed = 200;

  hasBeenConnected = false;
  connectionBufferTime = 0;
  // preUpdate에서 매 프레임 문자열 파싱을 피하기 위한 캐시
  private parsedAnimKey = "";
  private parsedAnim?: ReturnType<typeof splitAnimKey>;
  // 마지막으로 전송한 근접 볼륨 (변화 시에만 emit하기 위한 캐시)
  private lastVolume = -1;
  private volumeEmitAccum = 0;

  constructor(scene: Game, id: string, name: string, x: number, y: number, texture: string) {
    super(scene, id, x, y, texture);
    this.playerName.setText(name);
    this.destination = { x, y };
    this.containerBody = this.playerContainer.body as Phaser.Physics.Arcade.Body;
    this.playerOverlap = new PlayerOverlap(scene, this, x, y, this.width, this.height);
    scene.physics.add.existing(this.playerOverlap);

    const spriteBody = this.body as Phaser.Physics.Arcade.Body;
    spriteBody.setSize(this.width * 8, this.height * 4);
  }

  tryConnectWithPeer(localPlayer: LocalPlayer, webRTC: WebRTC) {
    if (
      !this.hasBeenConnected &&
      this.connectionBufferTime >= 1000 &&
      this.mediaConnect &&
      !this.isCalling &&
      !localPlayer.isCalling &&
      localPlayer.mediaConnect &&
      localPlayer.readyToStream &&
      this.playerId > localPlayer.playerId
    ) {
      this.hasBeenConnected = true;
      webRTC.peerCall(this.playerId, "proximity");
    } else if (
      this.hasBeenConnected &&
      (!this.mediaConnect || !localPlayer.mediaConnect || this.isCalling || localPlayer.isCalling)
    ) {
      eventEmitter.emit("CLOSE_PEER_CALL", this.playerId);
      this.hasBeenConnected = false;
      this.connectionBufferTime = 0;
      this.lastVolume = -1;
    }
  }

  updatePlayer(player: IPlayer) {
    const {
      name,
      x,
      y,
      readyToConnect,
      animKey,
      status,
      mediaConnect,
      videoEnabled,
      micEnabled,
      isCalling,
    } = player;
    // 서버 패치마다 호출되므로 변경된 값만 반영한다
    if (this.playerName.text !== name) this.playerName.setText(name);
    this.destination = { x, y };
    this.readyToConnect = readyToConnect;
    this.mediaConnect = mediaConnect;
    this.videoEnabled = videoEnabled;
    this.micEnabled = micEnabled;
    if (this.isCalling !== isCalling) this.setCallingState(isCalling);
    if (this.anims.currentAnim?.key !== animKey) this.anims.play(animKey, true);
    if (this.playerStatus !== status) this.setPlayerStatus(status);
  }

  protected preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
    const spriteBody = this.body as Phaser.Physics.Arcade.Body;

    this.playerOverlap.setPosition(this.x, this.y);
    this.playerMarker.setPosition(this.x, this.y);

    if (delta > 500) {
      this.setPosition(this.destination.x, this.destination.y);
      this.playerContainer.setPosition(this.destination.x, this.destination.y - this.height / 2);
      return;
    }

    const distance = (this.speed / 1000) * delta;
    let dx = this.destination.x - this.x;
    let dy = this.destination.y - this.y;

    if (Math.abs(dx) < distance) {
      this.x = this.destination.x;
      this.playerContainer.x = this.destination.x;
      dx = 0;
    }
    if (Math.abs(dy) < distance) {
      this.y = this.destination.y;
      this.playerContainer.y = this.destination.y - this.height / 2;
      dy = 0;
    }

    const vx = Math.sign(dx) * this.speed;
    const vy = Math.sign(dy) * this.speed;

    this.setVelocity(vx, vy);
    spriteBody.velocity.setLength(this.speed);
    this.containerBody.setVelocity(vx, vy);
    this.containerBody.velocity.setLength(this.speed);

    this.setDepth(this.y + this.height / 2);
    const currentAnimKey = this.anims.currentAnim!.key;
    if (this.parsedAnimKey !== currentAnimKey) {
      this.parsedAnimKey = currentAnimKey;
      this.parsedAnim = splitAnimKey(currentAnimKey);
    }
    const { character, state, sittingOffset } = this.parsedAnim!;
    this.playerTexture = character;
    if (state === "sit") {
      if (sittingOffset) {
        this.setDepth(this.y + this.height / 2 + sittingOffset[2]);
      }
    }

    // 근접 연결된 상대의 오디오 볼륨을 거리에 따라 조절 (연결/해제 로직은 그대로)
    if (this.hasBeenConnected) {
      const local = (this.scene as Game).localPlayer;
      if (local) {
        const dx = local.x - this.x;
        const dy = local.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const volume = Math.min(1, Math.max(0, 1 - dist / PROXIMITY_AUDIO_RADIUS));
        // 볼륨이 유의미하게 바뀌거나, 정지 상태에서도 0.5초마다 재전송(늦게 마운트된 RemoteVideo 동기화)
        this.volumeEmitAccum += delta;
        if (Math.abs(volume - this.lastVolume) > 0.02 || this.volumeEmitAccum > 500) {
          this.lastVolume = volume;
          this.volumeEmitAccum = 0;
          eventEmitter.emit("PROXIMITY_VOLUME_CHANGED", { id: this.playerId, volume });
        }
      }
    }

    // 실제로 겹쳐 있을 때만 근접 체류 시간을 누적한다.
    // (스쳐 지나감이나 스폰 지점 겹침으로 인한 원치 않는 자동 연결 방지)
    const overlapping = spriteBody.embedded || !spriteBody.touching.none;
    if (overlapping) {
      this.connectionBufferTime += delta;
    } else {
      this.connectionBufferTime = 0;
      if (this.hasBeenConnected) {
        eventEmitter.emit("CLOSE_PEER_CALL", this.playerId);
        this.hasBeenConnected = false;
        this.lastVolume = -1;
      }
    }
  }
  destroy(fromScene?: boolean) {
    this.playerContainer.destroy();
    super.destroy(fromScene);
  }
}
