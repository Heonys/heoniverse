import { Direction, ExtendedCursorKeys, WASD } from "@/constants/game";
import { createCharacterAnims } from "@/game/anims/CharacterAnims";
import {
  LocalPlayer,
  NpcPlayer,
  OtherPlayer,
  PlayerOverlap,
  PlayerSelector,
} from "@/game/characters";
import { Item, Chair, Computer, Whiteboard, Ball, BALL_RADIUS } from "@/game/objects";
import { Network } from "@/service";
import type { RestoreData } from "@/service";
import { getAIResponse } from "@/service/ai";
import { IPlayer, IChatMessage, BALL_SPAWN } from "@heoniverse/shared";
import { eventEmitter } from "@/game/events";
import { store } from "@/stores";
import { addPlayerName, removePlayerName, setLoggedIn } from "@/stores/userSlice";
import { setReconnecting } from "@/stores/roomSlice";
import { setNpcBusyBy } from "@/stores/aiSlice";
import { hide } from "@/stores/modalSlice";
import { setFocusChat, pushJoinedMessage, pushLeftMessage } from "@/stores/chatSlice";
import { setCurrentPage, setShowIphone } from "@/stores/phoneSlice";

const START_POINT = [1455, 1200];

export class Game extends Phaser.Scene {
  private cursor!: ExtendedCursorKeys;
  private map!: Phaser.Tilemaps.Tilemap;
  localPlayer!: LocalPlayer;
  playerSelector!: PlayerSelector;
  network!: Network;
  otherPlayers!: Phaser.Physics.Arcade.Group;
  otherPlayerOverlapZone!: Phaser.Physics.Arcade.Group;
  otherPlayersMap = new Map<string, OtherPlayer>();
  computersMap = new Map<string, Computer>();
  whiteboardsMap = new Map<string, Whiteboard>();
  npc?: NpcPlayer;
  ball?: Ball;
  // 내가 NPC와 나눈 대화 기록 (AI 컨텍스트용). 대화가 끝나면 비운다.
  npcHistory: IChatMessage[] = [];
  minimap?: Phaser.Cameras.Scene2D.Camera;

  constructor() {
    super("game");
  }

  create({ network, profile }: { network: Network; profile?: RestoreData }) {
    this.network = network;
    this.cursor = {
      ...this.input.keyboard!.createCursorKeys(),
      ...(this.input.keyboard!.addKeys("W,S,A,D") as WASD),
    };
    this.map = this.make.tilemap({ key: "tilemap" });
    createCharacterAnims(this.anims);
    this.registerEventHandler();
    this.registerKeyHandler();

    // 재접속이면 이전 좌표 그대로, 신규 입장이면 스폰을 살짝 분산한다
    // (모두 같은 지점에 스폰되면 입장 즉시 근접 자동연결이 걸린다)
    const spawnX = profile?.x ?? START_POINT[0] + Phaser.Math.Between(-48, 48);
    const spawnY = profile?.y ?? START_POINT[1] + Phaser.Math.Between(-96, 96);
    const avatar = profile?.avatar ?? "suit";

    this.localPlayer = new LocalPlayer(this, network.sessionId, spawnX, spawnY, avatar);
    this.playerSelector = new PlayerSelector(this, spawnX, spawnY, 16, 16);
    this.otherPlayers = this.physics.add.group();
    this.otherPlayerOverlapZone = this.physics.add.group();

    // AI 도우미 NPC — 스폰 근처 개활지에 고정 배치 (다가가 R로 대화). 좌표는 튜닝 가능
    this.npc = new NpcPlayer(this, "ai-npc", "AI 도우미", 1455, 1040, "ghost");
    this.otherPlayers.add(this.npc);
    this.otherPlayerOverlapZone.add(this.npc.playerOverlap);

    // 입장 시 이미 다른 사람이 대화 중일 수 있으므로 현재 잠금 상태를 초기 반영
    // (상태 리스너의 최초 콜백은 이 씬의 핸들러 등록 전에 지나가 놓칠 수 있음)
    const npcUser = network.room?.state.npcTalkingUser ?? "";
    store.dispatch(setNpcBusyBy(npcUser));
    this.npc.setBusy(npcUser !== "" && npcUser !== this.localPlayer.playerId);

    // 이미 방에 있던 플레이어를 초기 state에서 직접 스폰한다.
    // join 직후 100ms 뒤 발사되는 OTHER_PLAYER_JOINED는 이 씬의 핸들러 등록 전에
    // 지나갈 수 있고(유실되면 이후 UPDATED도 전부 버려져 영영 안 보인다), playerJoined가
    // 멱등이라 늦게 도착한 emit과 겹쳐도 무해하다.
    // players는 중첩 스키마라 입장 직후엔 아직 디코드 전일 수 있다(undefined) → 옵셔널 체이닝.
    // 이 경우 스냅샷은 건너뛰지만, create가 이미 리스너를 등록했으니 100ms emit이 대신 잡는다.
    network.room?.state.players?.forEach((player, sessionId) => {
      if (sessionId === network.sessionId) return;
      if (player.name === "") return; // 이름 미설정 유저는 listen("name") 경로가 스폰
      this.playerJoined(sessionId, player, false);
    });

    this.setupCamera();
    this.disableKeys();

    const floorAndGroundTileset = this.map.addTilesetImage("FloorAndGround", "tileset_wall")!;
    const floorAndGroundTileset3d = this.map.addTilesetImage("Wall_3d", "tileset_wall_3d")!;
    const groundLayer = this.map.createLayer("Floor", [
      floorAndGroundTileset,
      floorAndGroundTileset3d,
    ])!;
    groundLayer.setCollisionByProperty({ collides: true });

    this.addGroupFromTiled("Wall", "tileset_wall", "FloorAndGround", false);
    this.addGroupFromTiled("NonCollidable", "tileset_office", "Office", false);
    this.addGroupFromTiled("Generic", "tileset_generic", "Generic", false);
    this.addGroupFromTiled("JailNonCollidable", "tileset_jail", "Jail", false);
    // 플레이어가 막히는 고체 그룹 — 공도 같은 벽에 튕기도록 참조를 모아둔다
    const wallGroups = [
      this.addGroupFromTiled("Collidable", "tileset_office", "Office", true),
      this.addGroupFromTiled("JailCollidable", "tileset_jail", "Jail", true),
      this.addGroupFromTiled("Basement", "tileset_basement", "Basement", true),
      this.addGroupFromTiled("Kitchen", "tileset_kitchen", "Kitchen", true),
      this.addGroupFromTiled("Hospital", "tileset_hospital", "Hospital", true),
    ];

    const chairs = this.addInteractiveGroupFromTiled(
      Chair,
      "Chair",
      "tileset_1x2",
      "object1x2",
      (chair, _index, tileObject) => {
        chair.direction = tileObject.properties[0].value as Direction;

        if (chair.direction !== "up") {
          chair.setDepth(chair.y - chair.height / 2);
        }
      },
    );

    const computers = this.addInteractiveGroupFromTiled(
      Computer,
      "Computer",
      "tileset_3x2",
      "object3x2",
      (computer, index) => {
        const id = `${index}`;
        computer.id = id;
        this.computersMap.set(id, computer);
        this.network.createComputer(id);
      },
    );

    const whiteboard = this.addInteractiveGroupFromTiled(
      Whiteboard,
      "Whiteboard",
      "tileset_2x2",
      "object2x2",
      (whiteboard, index) => {
        const id = `${index}`;
        whiteboard.id = id;
        this.whiteboardsMap.set(id, whiteboard);
        this.network.createWhiteboard(id);
      },
    );

    this.physics.add.overlap(this.localPlayer, this.otherPlayers, (object1, object2) => {
      const localPlayer = object1 as LocalPlayer;
      const otherPlayer = object2 as OtherPlayer;
      otherPlayer.tryConnectWithPeer(localPlayer, this.network.webRTC!);
    });

    this.physics.add.overlap(
      this.playerSelector,
      this.otherPlayerOverlapZone,
      (object1, object2) => {
        const playerSelector = object1 as PlayerSelector;
        const otherPlayer = object2 as PlayerOverlap;

        if (playerSelector.playerOverlap) {
          if (playerSelector.playerOverlap === otherPlayer) return;
          otherPlayer.clearDialogBox();
        }
        playerSelector.playerOverlap = otherPlayer;
        otherPlayer.onOverlapDialog();
      },
    );

    this.physics.add.collider([this.localPlayer, this.localPlayer.playerContainer], groundLayer);
    this.physics.add.overlap(
      this.playerSelector,
      [chairs, computers, whiteboard],
      (object1, object2) => {
        const playerSelector = object1 as PlayerSelector;
        const overlappedItem = object2 as Item;

        if (playerSelector.selectedItem) {
          if (
            playerSelector.selectedItem === overlappedItem ||
            playerSelector.depth >= overlappedItem.depth
          ) {
            return;
          }
          playerSelector.selectedItem.clearDialogBox();
        }
        playerSelector.selectedItem = overlappedItem;
        overlappedItem.onOverlapDialog();
      },
    );

    // 공유 물리 공 — 벽/바닥과 충돌하고 월드 경계를 넘지 않는다. 플레이어와는 충돌 안 함(Space로만 참).
    this.createBallTexture();
    this.physics.world.setBounds(0, 0, 2400, 1600); // 공만 collideWorldBounds — 플레이어엔 영향 없음
    const ballStart = network.room?.state.ball ?? BALL_SPAWN;
    this.ball = new Ball(this, network, network.sessionId, ballStart.x, ballStart.y);
    if (!network.room) this.ball.becomeLocalToy(); // 오프라인이면 로컬 장난감으로
    wallGroups.forEach((group) => this.physics.add.collider(this.ball!, group));
    this.physics.add.collider(this.ball, groundLayer);

    // 신규 입장(EntryScreen)·자동 재접속 모두 프로필을 들고 들어온다 — 여기서 로그인 마무리
    if (profile) this.applyProfile(profile);
  }

  // 프로필(닉네임·아바타)로 곧장 플레이 가능한 상태로 만든다 (신규 입장·재접속 공용)
  private applyProfile(profile: RestoreData) {
    this.localPlayer.setPlayerName(profile.nickname);
    this.localPlayer.setPlayerAvatar(profile.avatar);
    this.localPlayer.readyToConnect = true;
    this.network.readyToConnect();
    this.enableKeys();
    store.dispatch(setLoggedIn(true));
    store.dispatch(setReconnecting(false));
    // 이 시점의 방·프로필 스냅샷을 저장해 새로고침 시 자동 재접속에 사용 (오프라인 모드는 내부에서 무시)
    this.network.persistSession();
  }

  setupCamera() {
    this.cameras.main.setZoom(1.4);
    this.cameras.main.startFollow(this.localPlayer);
  }

  setupMinimapCamera() {
    this.minimap = this.cameras
      .add(0, 0, 160, 160, false, "minimap")
      .setZoom(0.15)
      .setBackgroundColor("#000")
      .startFollow(this.localPlayer);
    this.minimap.postFX.addColorMatrix().grayscale(0.8);

    const maskGraphic = this.add.graphics().fillCircle(80, 80, 70);
    const mask = maskGraphic.createGeometryMask();
    this.minimap.setMask(mask);

    this.localPlayer.setupMinimap();
    this.otherPlayersMap.forEach((player) => {
      player.setupMinimap();
    });
  }

  removeMinimapCamera() {
    if (this.minimap) {
      this.cameras.remove(this.minimap);
    }
  }

  update(_time: number, delta: number) {
    if (this.localPlayer) {
      this.localPlayer.update(this.playerSelector, this.cursor, this.network, delta);
      this.playerSelector.update(this.localPlayer, this.cursor);
    }
  }

  // 전용 입력바에서 NPC에게 말하기: 내 말풍선(로컬+전파) → AI 답 → NPC 말풍선(로컬+전파).
  // 비동기 왕복은 씬 생명주기에 묶여 안전.
  sendToNpc(message: string) {
    if (!store.getState().ai.talking || !this.npc) return;
    const content = message.trim();
    if (!content) return;

    // 내 말 — 말풍선(로컬) + 다른 사람에게 전파 (방 채팅 로그엔 안 남김)
    this.localPlayer.openBubble(content);
    this.network.sendMessage("NPC_USER_SAY", content);

    this.npcHistory.push({
      clientId: this.localPlayer.playerId,
      author: this.localPlayer.playerName.text,
      content,
      createdAt: Date.now(),
    });

    // 답이 오기 전까지 NPC 머리 위에 '생각 중' 애니메이션을 띄운다
    this.npc.openThinkingBubble();

    getAIResponse(this.npcHistory).then((reply) => {
      // 답이 오기 전에 대화가 끝났으면 '생각 중' 말풍선을 정리하고 버린다
      if (!store.getState().ai.talking || !this.npc) {
        this.npc?.closeBubble();
        return;
      }
      this.npcHistory.push({
        clientId: "ai-npc",
        author: "AI 도우미",
        content: reply,
        createdAt: Date.now(),
      });
      this.npc.openBubble(reply); // 내 화면 (브로드캐스트는 나를 제외하므로 로컬 렌더)
      this.network.sayAsNpc(reply); // 방의 다른 사람들에게 NPC 답풍선 전파
    });
  }

  registerEventHandler() {
    const onPlayerJoined = ({ sessionId, player }: { sessionId: string; player: IPlayer }) => {
      this.playerJoined(sessionId, player);
    };
    const onPlayerUpdated = ({ sessionId, player }: { sessionId: string; player: IPlayer }) => {
      this.playerUpdated(sessionId, player);
    };
    const onPlayerLeft = ({ sessionId, player }: { sessionId: string; player: IPlayer }) => {
      this.playerLeft(sessionId, player);
    };
    const onChatMessage = ({ sessionId, message }: { sessionId: string; message: string }) => {
      const otherPlayer = this.otherPlayersMap.get(sessionId);
      if (otherPlayer) {
        otherPlayer.openBubble(message);
      }
    };
    const onEmote = ({ sessionId, emote }: { sessionId: string; emote: string }) => {
      this.otherPlayersMap.get(sessionId)?.showEmote(emote);
    };
    // 다른 사람이 대화 중인 NPC의 답풍선 (내가 보낸 건 로컬에서 이미 렌더됨)
    const onNpcSaid = ({ message }: { message: string }) => {
      this.npc?.openBubble(message);
    };
    // 대화 중인 유저가 친 말 — 그 유저 캐릭터 위 말풍선으로 (내 화면엔 로컬에서 이미 렌더됨)
    const onNpcUserSaid = ({ sessionId, message }: { sessionId: string; message: string }) => {
      this.otherPlayersMap.get(sessionId)?.openBubble(message);
    };
    // NPC 점유 상태 변화 — 리덕스에 반영하고 NPC 위 "대화 중" 라벨을 토글
    const onNpcTalkingChanged = ({ sessionId }: { sessionId: string }) => {
      store.dispatch(setNpcBusyBy(sessionId));
      const occupiedByOther = sessionId !== "" && sessionId !== this.localPlayer?.playerId;
      this.npc?.setBusy(occupiedByOther);
    };
    const onComputerUserAdded = ({
      userId,
      computerId,
    }: {
      userId: string;
      computerId: string;
    }) => {
      const computer = this.computersMap.get(computerId);
      if (computer) {
        computer.connected(userId);
      }
    };
    const onComputerUserRemoved = ({
      userId,
      computerId,
    }: {
      userId: string;
      computerId: string;
    }) => {
      const computer = this.computersMap.get(computerId);
      if (computer) {
        computer.disConnected(userId);
      }
    };
    const onWhiteboardUserAdded = ({
      userId,
      whiteboardId,
    }: {
      userId: string;
      whiteboardId: string;
    }) => {
      const whiteboard = this.whiteboardsMap.get(whiteboardId);
      if (whiteboard) {
        whiteboard.connected(userId);
      }
    };
    const onWhiteboardUserRemoved = ({
      userId,
      whiteboardId,
    }: {
      userId: string;
      whiteboardId: string;
    }) => {
      const whiteboard = this.whiteboardsMap.get(whiteboardId);
      if (whiteboard) {
        whiteboard.disConnected(userId);
      }
    };
    // 공 서버 상태 변화 → 공 스프라이트에 반영(주인이면 무시, 아니면 보간)
    const onBallChanged = ({ x, y, ownerId }: { x: number; y: number; ownerId: string }) => {
      this.ball?.applyServer(x, y, ownerId);
    };

    eventEmitter.on("OTHER_PLAYER_JOINED", onPlayerJoined);
    eventEmitter.on("OTHER_PLAYER_UPDATED", onPlayerUpdated);
    eventEmitter.on("OTHER_PLAYER_LEFT", onPlayerLeft);
    eventEmitter.on("UPDATED_CHAT_MESSAGE", onChatMessage);
    eventEmitter.on("UPDATED_EMOTE", onEmote);
    eventEmitter.on("NPC_SAID", onNpcSaid);
    eventEmitter.on("NPC_USER_SAID", onNpcUserSaid);
    eventEmitter.on("NPC_TALKING_CHANGED", onNpcTalkingChanged);
    eventEmitter.on("COMPUTER_USER_ADDED", onComputerUserAdded);
    eventEmitter.on("COMPUTER_USER_REMOVED", onComputerUserRemoved);
    eventEmitter.on("WHITEBOARD_USER_ADDED", onWhiteboardUserAdded);
    eventEmitter.on("WHITEBOARD_USER_REMOVED", onWhiteboardUserRemoved);
    eventEmitter.on("BALL_CHANGED", onBallChanged);

    // 씬이 재시작돼도 핸들러가 중복 등록되지 않도록 정리한다
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      eventEmitter.off("OTHER_PLAYER_JOINED", onPlayerJoined);
      eventEmitter.off("OTHER_PLAYER_UPDATED", onPlayerUpdated);
      eventEmitter.off("OTHER_PLAYER_LEFT", onPlayerLeft);
      eventEmitter.off("UPDATED_CHAT_MESSAGE", onChatMessage);
      eventEmitter.off("UPDATED_EMOTE", onEmote);
      eventEmitter.off("NPC_SAID", onNpcSaid);
      eventEmitter.off("NPC_USER_SAID", onNpcUserSaid);
      eventEmitter.off("NPC_TALKING_CHANGED", onNpcTalkingChanged);
      eventEmitter.off("COMPUTER_USER_ADDED", onComputerUserAdded);
      eventEmitter.off("COMPUTER_USER_REMOVED", onComputerUserRemoved);
      eventEmitter.off("WHITEBOARD_USER_ADDED", onWhiteboardUserAdded);
      eventEmitter.off("WHITEBOARD_USER_REMOVED", onWhiteboardUserRemoved);
      eventEmitter.off("BALL_CHANGED", onBallChanged);
    });
  }

  registerKeyHandler() {
    this.input.keyboard?.on("keydown-ENTER", () => {
      store.dispatch(setShowIphone(true));
      store.dispatch(setCurrentPage({ page: "messages" }));
      store.dispatch(setFocusChat(true));
      this.localPlayer.isPhoneAnimating = true;
    });

    this.input.keyboard?.on("keydown-ESC", () => {
      const state = store.getState();

      if (state.phone.showIphone) {
        store.dispatch(setShowIphone(false));
        store.dispatch(setFocusChat(false));
      }
      store.dispatch(hide());
    });

    this.input.keyboard?.on("keydown-G", () => {
      // 채팅 입력 중이면 그냥 'g' 타이핑 (휠 열지 않음)
      if (store.getState().chat.focused) return;
      eventEmitter.emit("TOGGLE_EMOTE_WHEEL");
    });
  }

  // 코드로 축구공 텍스처를 1회 생성(에셋 불필요): 흰 공 + 진한 테두리 +
  // 중앙 검은 오각형 1개와 테두리 쪽 오각형 5개(그 사이 흰 공간이 육각형처럼 읽힘)
  private createBallTexture() {
    if (this.textures.exists("ball")) return;
    const R = BALL_RADIUS;
    const DARK = 0x111827;
    const g = this.add.graphics();

    g.fillStyle(0xf8fafc, 1).fillCircle(R, R, R);
    g.lineStyle(2, DARK, 1).strokeCircle(R, R, R - 1);

    // (cx,cy) 중심의 오각형 꼭짓점들 (rot=회전 라디안)
    const pentagon = (cx: number, cy: number, r: number, rot: number) =>
      Array.from({ length: 5 }, (_, i) => {
        const a = rot + (-90 + i * 72) * Phaser.Math.DEG_TO_RAD;
        return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
      });

    g.fillStyle(DARK, 1);
    g.fillPoints(pentagon(R, R, R * 0.32, 0), true); // 중앙
    for (let i = 0; i < 5; i++) {
      const a = (-90 + i * 72) * Phaser.Math.DEG_TO_RAD;
      const cx = R + R * 0.62 * Math.cos(a);
      const cy = R + R * 0.62 * Math.sin(a);
      g.fillPoints(pentagon(cx, cy, R * 0.22, Math.PI), true); // 테두리 쪽(안쪽을 향해 뒤집음)
    }

    g.generateTexture("ball", R * 2, R * 2);
    g.destroy();
  }

  private addObjectFromTiled(
    group: Phaser.Physics.Arcade.StaticGroup,
    object: Phaser.Types.Tilemaps.TiledObject,
    texture: string,
    tilesetName: string,
  ) {
    // Tiled 좌표계 기준을 Phaser 좌표계로 변환
    const actualX = object.x! + object.width! * 0.5;
    const actualY = object.y! - object.height! * 0.5;
    const obj = group
      .get(actualX, actualY, texture, object.gid! - this.map.getTileset(tilesetName)!.firstgid)
      .setDepth(actualY + object.height! / 2);
    return obj;
  }

  private addGroupFromTiled(
    objectLayerName: string,
    texture: string,
    tilesetName: string,
    collidable: boolean,
  ) {
    const group = this.physics.add.staticGroup();
    const objectLayer = this.map.getObjectLayer(objectLayerName)!;

    objectLayer.objects.forEach((object) => {
      this.addObjectFromTiled(group, object, texture, tilesetName);
    });
    if (this.localPlayer && collidable) {
      this.physics.add.collider([this.localPlayer, this.localPlayer.playerContainer], group);
    }
    return group;
  }

  private addInteractiveGroupFromTiled<T extends typeof Item, S = InstanceType<T>>(
    classType: T,
    objectLayerName: string,
    texture: string,
    tilesetName: string,
    updater: (object: S, index: number, tileObject: Phaser.Types.Tilemaps.TiledObject) => void,
  ) {
    const group = this.physics.add.staticGroup({ classType });
    const objectLayer = this.map.getObjectLayer(objectLayerName)!;

    objectLayer.objects.forEach((chairObj, index) => {
      const item = this.addObjectFromTiled(group, chairObj, texture, tilesetName) as S;
      updater(item, index, chairObj);
    });
    return group;
  }

  disableKeys() {
    this.input.keyboard!.enabled = false;
    this.resetCursorKeys();
  }

  enableKeys() {
    this.input.keyboard!.enabled = true;
  }

  resetCursorKeys() {
    const { down, left, right, up } = this.cursor;
    left.reset();
    right.reset();
    up.reset();
    down.reset();
  }

  // announce=false는 입장 시 이미 있던 플레이어의 스냅샷 스폰용 — "입장" 메시지를 생략한다
  playerJoined(id: string, player: IPlayer, announce = true) {
    if (this.otherPlayersMap.has(id)) return;

    const { name, x, y } = player;
    const otherPlayer = new OtherPlayer(this, id, name, x, y, "suit");
    this.otherPlayers.add(otherPlayer);
    this.otherPlayerOverlapZone.add(otherPlayer.playerOverlap);
    this.otherPlayersMap.set(id, otherPlayer);
    store.dispatch(addPlayerName({ id, name }));
    if (announce) store.dispatch(pushJoinedMessage({ id, name }));
    otherPlayer.updatePlayer(player);
  }

  playerLeft(id: string, player: IPlayer) {
    if (this.otherPlayersMap.has(id)) {
      const otherPlayer = this.otherPlayersMap.get(id)!;
      this.otherPlayers.remove(otherPlayer, true, true);
      this.otherPlayerOverlapZone.remove(otherPlayer.playerOverlap, true, true);
      this.otherPlayersMap.delete(id);
      otherPlayer.playerMarker.destroy();

      store.dispatch(removePlayerName(id));
      store.dispatch(pushLeftMessage({ id, name: player.name }));
    }
  }

  playerUpdated(id: string, payload: IPlayer) {
    const otherPlayer = this.otherPlayersMap.get(id);
    if (!otherPlayer) return;
    otherPlayer.updatePlayer(payload);
  }
}
