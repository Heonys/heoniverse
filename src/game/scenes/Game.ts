import { nanoid } from "@reduxjs/toolkit";
import { Direction } from "@/constants";
import { createCharacterAnims } from "@/game/anims/CharacterAnims";
import { LocalPlayer, OtherPlayer, PlayerSelector } from "@/game/characters";
import { Item, Chair, Computer, Whiteboard } from "@/game/objects";
import { Network } from "@/service/Network";
import { IPlayer } from "@server/src/types";
import { eventEmitter } from "@/game/events";

export class Game extends Phaser.Scene {
  private cursor!: Phaser.Types.Input.Keyboard.CursorKeys;
  private map!: Phaser.Tilemaps.Tilemap;
  localPlayer!: LocalPlayer;
  playerSelector!: PlayerSelector;
  network!: Network;
  otherPlayers!: Phaser.Physics.Arcade.Group;
  ohterPlayersMap = new Map<string, OtherPlayer>();

  constructor() {
    super("game");
  }

  create({ network }: { network: Network }) {
    this.network = network;
    this.cursor = this.input.keyboard!.createCursorKeys();
    this.map = this.make.tilemap({ key: "tilemap" });
    createCharacterAnims(this.anims);
    this.registerEventHandler();

    this.localPlayer = new LocalPlayer(this, network.sessionId, 705, 500, "adam");
    this.playerSelector = new PlayerSelector(this, 705, 500, 16, 16);
    this.otherPlayers = this.physics.add.group();
    this.setupCamera(this.localPlayer);
    this.disableKeys();

    const floorAndGroundTileset = this.map.addTilesetImage("FloorAndGround", "tileset_wall")!;
    const groundLayer = this.map.createLayer("Ground", floorAndGroundTileset)!;
    groundLayer.setCollisionByProperty({ collides: true });

    this.addGroupFromTiled("Wall", "tileset_wall", "FloorAndGround", false);

    const chairs = this.addInteractiveGroupFromTiled(
      Chair,
      "Chair",
      "tileset_chairs",
      "chair",
      (chair, tileObject) => {
        chair.direction = tileObject.properties[0].value as Direction;
      },
    );

    const computers = this.addInteractiveGroupFromTiled(
      Computer,
      "Computer",
      "tileset_computers",
      "computer",
      (computer) => {
        computer.id = nanoid();
      },
    );

    const whiteboard = this.addInteractiveGroupFromTiled(
      Whiteboard,
      "Whiteboard",
      "tileset_whiteboards",
      "whiteboard",
      (whiteboard) => {
        whiteboard.id = nanoid();
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
  }

  setupCamera(object: Phaser.Physics.Arcade.Sprite) {
    this.cameras.main.setZoom(1.5);
    this.cameras.main.startFollow(object);
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

    eventEmitter.on("OTHER_PLAYER_LEFT", (playerId) => {
      this.playerLeft(playerId);
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
    updater: (object: S, tileObject: Phaser.Types.Tilemaps.TiledObject) => void,
  ) {
    const group = this.physics.add.staticGroup({ classType });
    const objectLayer = this.map.getObjectLayer(objectLayerName)!;

    objectLayer.objects.forEach((chairObj) => {
      const item = this.addObjectFromTiled(group, chairObj, texture, tilesetName) as S;
      updater(item, chairObj);
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

  playerJoined(id: string, payload: IPlayer) {
    if (this.ohterPlayersMap.has(id)) return;

    const { name, x, y } = payload;
    const otherPlayer = new OtherPlayer(this, id, name, x, y, "adam");
    this.otherPlayers.add(otherPlayer);
    this.ohterPlayersMap.set(id, otherPlayer);
  }

  playerLeft(id: string) {
    if (this.ohterPlayersMap.has(id)) {
      const otherPlayer = this.ohterPlayersMap.get(id)!;
      this.otherPlayers.remove(otherPlayer, true, true);
      this.ohterPlayersMap.delete(id);
    }
  }

  playerUpdated(id: string, payload: IPlayer) {
    const otherPlayer = this.ohterPlayersMap.get(id);
    if (!otherPlayer) return;

    otherPlayer.updatePlayer(payload);
  }
}
