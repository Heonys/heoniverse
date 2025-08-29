import { LocalPlayer, Player, PlayerOverlap } from "@/game/characters";
import { spliteAnimKey } from "@/utils";
import { IPlayer } from "@heoniverse/shared";
import { Game } from "@/game/scenes";
import { WebRTC } from "@/service";
import { eventEmitter } from "@/game/events";

export class OtherPlayer extends Player {
  playerOverlap: PlayerOverlap;
  containerBody: Phaser.Physics.Arcade.Body;
  destination = { x: 0, y: 0 };
  speed = 200;

  hasBeenConnected = false;
  connectionBufferTime = 0;

  constructor(scene: Game, id: string, name: string, x: number, y: number, texture: string) {
    super(scene, id, x, y, texture);
    this.playerName.setText(name);
    this.destination = { x, y };
    this.containerBody = this.playerContainer.body as Phaser.Physics.Arcade.Body;
    this.playerOverlap = new PlayerOverlap(scene, this, x, y, this.width, this.height);
    scene.physics.add.existing(this.playerOverlap);

    const spriteBody = this.body as Phaser.Physics.Arcade.Body;
    spriteBody.setSize(this.width * 4, this.height * 2.5);
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
      isUsingComputer,
      isUsingWhiteboard,
    } = player;
    this.playerName.setText(name);
    this.destination = { x, y };
    this.readyToConnect = readyToConnect;
    this.mediaConnect = mediaConnect;
    this.videoEnabled = videoEnabled;
    this.micEnabled = micEnabled;
    this.setCallingState(isCalling);
    this.anims.play(animKey, true);
    this.setPlayerStatus(status);

    if (isUsingComputer) {
      this.openStatusBox("컴퓨터 사용중...");
    } else if (isUsingWhiteboard) {
      this.openStatusBox("화이트보드 사용중...");
    } else {
      this.closeStatusBox();
    }
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

    this.setDepth(this.y);
    const { character, state, sittingOffset } = spliteAnimKey(this.anims.currentAnim!.key);
    this.playerTexture = character;
    if (state === "sit") {
      if (sittingOffset) {
        this.setDepth(this.y + sittingOffset[2]);
      }
    }

    this.connectionBufferTime += delta;
    if (this.hasBeenConnected && !spriteBody.embedded && spriteBody.touching.none) {
      eventEmitter.emit("CLOSE_PEER_CALL", this.playerId);
      this.connectionBufferTime = 0;
      this.hasBeenConnected = false;
    }
  }
  destroy(fromScene?: boolean) {
    this.playerContainer.destroy();
    super.destroy(fromScene);
  }
}
