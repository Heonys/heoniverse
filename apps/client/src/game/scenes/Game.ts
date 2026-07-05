import { Direction, ExtendedCursorKeys, WASD } from "@/constants/game";
import { createCharacterAnims } from "@/game/anims/CharacterAnims";
import {
  LocalPlayer,
  NpcPlayer,
  OtherPlayer,
  PlayerOverlap,
  PlayerSelector,
} from "@/game/characters";
import { Item, Chair, Computer, Whiteboard } from "@/game/objects";
import { Network } from "@/service";
import type { RestoreData } from "@/service";
import { getAIResponse } from "@/service/ai";
import { IPlayer, IChatMessage } from "@heoniverse/shared";
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
  // 내가 NPC와 나눈 대화 기록 (AI 컨텍스트용). 대화가 끝나면 비운다.
  npcHistory: IChatMessage[] = [];
  minimap?: Phaser.Cameras.Scene2D.Camera;

  constructor() {
    super("game");
  }

  create({ network, restore }: { network: Network; restore?: RestoreData }) {
    this.network = network;
    this.cursor = {
      ...this.input.keyboard!.createCursorKeys(),
      ...(this.input.keyboard!.addKeys("W,S,A,D") as WASD),
    };
    this.map = this.make.tilemap({ key: "tilemap" });
    createCharacterAnims(this.anims);
    this.registerEventHandler();
    this.registerKeyHandler();

    // 재접속이면 이전 좌표/아바타 그대로, 아니면 스폰을 살짝 분산한다
    // (모두 같은 지점에 스폰되면 입장 즉시 근접 자동연결이 걸린다)
    const spawnX = restore ? restore.x : START_POINT[0] + Phaser.Math.Between(-48, 48);
    const spawnY = restore ? restore.y : START_POINT[1] + Phaser.Math.Between(-96, 96);
    const avatar = restore ? restore.avatar : "suit";

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
    this.addGroupFromTiled("Collidable", "tileset_office", "Office", true);
    this.addGroupFromTiled("NonCollidable", "tileset_office", "Office", false);
    this.addGroupFromTiled("Generic", "tileset_generic", "Generic", false);
    this.addGroupFromTiled("JailCollidable", "tileset_jail", "Jail", true);
    this.addGroupFromTiled("JailNonCollidable", "tileset_jail", "Jail", false);
    this.addGroupFromTiled("Basement", "tileset_basement", "Basement", true);
    this.addGroupFromTiled("Kitchen", "tileset_kitchen", "Kitchen", true);
    this.addGroupFromTiled("Hospital", "tileset_hospital", "Hospital", true);

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

    // 자동 재접속이면 로그인 UI를 거치지 않으므로 LoginDialog가 하던 마무리를 여기서 재현한다
    if (restore) this.applyRestoredSession(restore);
  }

  // 저장된 프로필로 로그인 없이 곧장 플레이 가능한 상태로 만든다 (LoginDialog.onSubmit 꼬리와 동일)
  private applyRestoredSession(restore: RestoreData) {
    this.localPlayer.setPlayerName(restore.nickname);
    this.localPlayer.setPlayerAvatar(restore.avatar);
    this.localPlayer.readyToConnect = true;
    this.network.readyToConnect();
    this.enableKeys();
    store.dispatch(setLoggedIn(true));
    store.dispatch(setReconnecting(false));
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

    getAIResponse(this.npcHistory).then((reply) => {
      // 답이 오기 전에 대화가 끝났으면 버린다
      if (!store.getState().ai.talking || !this.npc) return;
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

  playerJoined(id: string, player: IPlayer) {
    if (this.otherPlayersMap.has(id)) return;

    const { name, x, y } = player;
    const otherPlayer = new OtherPlayer(this, id, name, x, y, "suit");
    this.otherPlayers.add(otherPlayer);
    this.otherPlayerOverlapZone.add(otherPlayer.playerOverlap);
    this.otherPlayersMap.set(id, otherPlayer);
    store.dispatch(addPlayerName({ id, name }));
    store.dispatch(pushJoinedMessage({ id, name }));
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
