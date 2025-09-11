import { Direction, ExtendedCursorKeys, WASD } from "@/constants/game";
import { createCharacterAnims } from "@/game/anims/CharacterAnims";
import { LocalPlayer, OtherPlayer, PlayerOverlap, PlayerSelector } from "@/game/characters";
import { Item, Chair, Computer, Whiteboard } from "@/game/objects";
import { Network } from "@/service";
import { IPlayer } from "@heoniverse/shared";
import { eventEmitter } from "@/game/events";
import { store } from "@/stores";
import { addPlayerName, removePlayerName } from "@/stores/userSlice";
import { hide } from "@/stores/modalSlice";
import { setFocusChat, pushJoinedMessage, pushLeftMessage, markAsRead } from "@/stores/chatSlice";
import { setCurrentPage, setShowIphone } from "@/stores/phoneSlice";

export class Game extends Phaser.Scene {
  private cursor!: ExtendedCursorKeys;
  private map!: Phaser.Tilemaps.Tilemap;
  localPlayer!: LocalPlayer;
  playerSelector!: PlayerSelector;
  network!: Network;
  otherPlayers!: Phaser.Physics.Arcade.Group;
  ohterPlayerOverlapZone!: Phaser.Physics.Arcade.Group;
  ohterPlayersMap = new Map<string, OtherPlayer>();
  computersMap = new Map<string, Computer>();
  whiteboardsMap = new Map<string, Whiteboard>();
  minimap?: Phaser.Cameras.Scene2D.Camera;

  constructor() {
    super("game");
  }

  create({ network }: { network: Network }) {
    this.network = network;
    this.cursor = {
      ...this.input.keyboard!.createCursorKeys(),
      ...(this.input.keyboard!.addKeys("W,S,A,D") as WASD),
    };
    this.map = this.make.tilemap({ key: "tilemap" });
    createCharacterAnims(this.anims);
    this.registerEventHandler();
    this.registerKeyHandler();

    this.localPlayer = new LocalPlayer(this, network.sessionId, 45 * 32, 42 * 32, "police");
    this.playerSelector = new PlayerSelector(this, 45 * 32, 42 * 32, 16, 16);
    this.otherPlayers = this.physics.add.group();
    this.ohterPlayerOverlapZone = this.physics.add.group();

    this.setupCamera();
    this.disableKeys();

    const floorAndGroundTileset = this.map.addTilesetImage("FloorAndGround", "tileset_wall")!;
    const groundLayer = this.map.createLayer("Floor", floorAndGroundTileset)!;
    // groundLayer.setCollisionByProperty({ collides: true });

    // this.addGroupFromTiled("Wall", "tileset_wall", "FloorAndGround", false);

    // const chairs = this.addInteractiveGroupFromTiled(
    //   Chair,
    //   "Chair",
    //   "tileset_chairs",
    //   "chair",
    //   (chair, _index, tileObject) => {
    //     chair.direction = tileObject.properties[0].value as Direction;
    //   },
    // );

    // const computers = this.addInteractiveGroupFromTiled(
    //   Computer,
    //   "Computer",
    //   "tileset_computers",
    //   "computer",
    //   (computer, index) => {
    //     const id = `${index}`;
    //     computer.id = id;
    //     this.computersMap.set(id, computer);
    //     this.network.createComputer(id);
    //   },
    // );

    // const whiteboard = this.addInteractiveGroupFromTiled(
    //   Whiteboard,
    //   "Whiteboard",
    //   "tileset_whiteboards",
    //   "whiteboard",
    //   (whiteboard, index) => {
    //     const id = `${index}`;
    //     whiteboard.id = id;
    //     this.whiteboardsMap.set(id, whiteboard);
    //     this.network.createWhiteboard(id);
    //   },
    // );

    this.physics.add.overlap(this.localPlayer, this.otherPlayers, (object1, object2) => {
      const localPlayer = object1 as LocalPlayer;
      const otherPlayer = object2 as OtherPlayer;
      otherPlayer.tryConnectWithPeer(localPlayer, this.network.webRTC!);
    });

    this.physics.add.overlap(
      this.playerSelector,
      this.ohterPlayerOverlapZone,
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

    // this.physics.add.collider([this.localPlayer, this.localPlayer.playerContainer], groundLayer);
    // this.physics.add.overlap(
    //   this.playerSelector,
    //   [chairs, computers, whiteboard],
    //   (object1, object2) => {
    //     const playerSelector = object1 as PlayerSelector;
    //     const overlappedItem = object2 as Item;

    //     if (playerSelector.selectedItem) {
    //       if (
    //         playerSelector.selectedItem === overlappedItem ||
    //         playerSelector.depth >= overlappedItem.depth
    //       ) {
    //         return;
    //       }
    //       playerSelector.selectedItem.clearDialogBox();
    //     }
    //     playerSelector.selectedItem = overlappedItem;
    //     overlappedItem.onOverlapDialog();
    //   },
    // );
  }

  setupCamera() {
    this.cameras.main.setZoom(1.2);
    this.cameras.main.startFollow(this.localPlayer);
  }

  setupMinimapCamera() {
    this.minimap = this.cameras
      .add(0, 0, 160, 160, false, "minimap")
      .setZoom(0.14)
      .setBackgroundColor("#000")
      .startFollow(this.localPlayer);
    this.minimap.postFX.addColorMatrix().grayscale(0.8);

    const maskGraphic = this.add.graphics().fillCircle(80, 80, 70);
    const mask = maskGraphic.createGeometryMask();
    this.minimap.setMask(mask);

    this.localPlayer.setupMinimap();
    this.ohterPlayersMap.forEach((player) => {
      player.setupMinimap();
    });
  }

  removeMinimapCamera() {
    if (this.minimap) {
      this.cameras.remove(this.minimap);
    }
  }

  update(_time: number, _delta: number) {
    if (this.localPlayer) {
      this.localPlayer.update(this.playerSelector, this.cursor, this.network);
      this.playerSelector.update(this.localPlayer, this.cursor);
    }
  }

  registerEventHandler() {
    eventEmitter.on("OTHER_PLAYER_JOINED", ({ sessionId, player }) => {
      this.playerJoined(sessionId, player);
    });
    eventEmitter.on("OTHER_PLAYER_UPDATED", ({ sessionId, player }) => {
      this.playerUpdated(sessionId, player);
    });
    eventEmitter.on("OTHER_PLAYER_LEFT", ({ sessionId, player }) => {
      this.playerLeft(sessionId, player);
    });
    eventEmitter.on("UPDATED_CHAT_MESSAGE", ({ sessionId, message }) => {
      const otherPlayer = this.ohterPlayersMap.get(sessionId);
      if (otherPlayer) {
        otherPlayer.openBubble(message);
      }
    });

    eventEmitter.on("COMPUTER_USER_ADDED", ({ userId, computerId }) => {
      const computer = this.computersMap.get(computerId);
      if (computer) {
        computer.connected(userId);
      }
    });
    eventEmitter.on("COMPUTER_USER_REMOVED", ({ userId, computerId }) => {
      const computer = this.computersMap.get(computerId);
      if (computer) {
        computer.disConnected(userId);
      }
    });

    eventEmitter.on("WHITEBOARD_USER_ADDED", ({ userId, whiteboardId }) => {
      const whiteboard = this.whiteboardsMap.get(whiteboardId);
      if (whiteboard) {
        whiteboard.connected(userId);
      }
    });
    eventEmitter.on("WHITEBOARD_USER_REMOVED", ({ userId, whiteboardId }) => {
      const whiteboard = this.whiteboardsMap.get(whiteboardId);
      if (whiteboard) {
        whiteboard.disConnected(userId);
      }
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

      if (state.chat.showChat) {
        store.dispatch(setShowIphone(false));
        store.dispatch(setFocusChat(false));
        store.dispatch(markAsRead());
      }
      if (state.phone.showIphone) {
        store.dispatch(setShowIphone(false));
      }
      store.dispatch(hide());
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
      .setDepth(actualY);
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
    if (this.ohterPlayersMap.has(id)) return;

    const { name, x, y } = player;
    const otherPlayer = new OtherPlayer(this, id, name, x, y, "suit");
    this.otherPlayers.add(otherPlayer);
    this.ohterPlayerOverlapZone.add(otherPlayer.playerOverlap);
    this.ohterPlayersMap.set(id, otherPlayer);
    store.dispatch(addPlayerName({ id, name }));
    store.dispatch(pushJoinedMessage({ id, name }));
    otherPlayer.updatePlayer(player);
  }

  playerLeft(id: string, player: IPlayer) {
    if (this.ohterPlayersMap.has(id)) {
      const otherPlayer = this.ohterPlayersMap.get(id)!;
      this.otherPlayers.remove(otherPlayer, true, true);
      this.ohterPlayerOverlapZone.remove(otherPlayer.playerOverlap, true, true);
      this.ohterPlayersMap.delete(id);
      otherPlayer.playerMarker.destroy();

      store.dispatch(removePlayerName(id));
      store.dispatch(pushLeftMessage({ id, name: player.name }));
    }
  }

  playerUpdated(id: string, payload: IPlayer) {
    const otherPlayer = this.ohterPlayersMap.get(id);
    if (!otherPlayer) return;
    otherPlayer.updatePlayer(payload);
  }
}
