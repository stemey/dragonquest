import * as Phaser from "phaser";
import { DragonQuest } from "../gameplay/hub/DragonQuest";
import TileLayerFactory from "../tile/TileLayerFactory";
import { PickUpAction } from "../gameplay/worldaction/PickupAction";
import { MonsterAction } from "../gameplay/battle/MonsterAction";
import { EntryAction } from "../gameplay/worldaction/EntryAction";
import { CharacterAction } from "../gameplay/worldaction/CharacterAction";
import { LayerObject } from "../gameplay/worldaction/LayerObject";
import { DialogAction } from "../gameplay/worldaction/DialogAction";
import {
    GatewayEntry,
    LoadEntry,
    WorldEntryParameter,
} from "./WorldEntryParameter";
import { ChestAction } from "../gameplay/worldaction/ChestAction";
import { ObstacleAction } from "../gameplay/worldaction/ObstacleAction";
import { dragonQuestConfiguration } from "../boot/DragonQuestConfiguration";
import { Gateway } from "../../generated/tiled-types/Gateway";
import { Entry } from "../../generated/tiled-types/Entry";
import { SceneTransitions } from "../gameplay/SceneTransitions";

export class AbstractWorld extends Phaser.Scene {
    private entries: { [key: string]: LayerObject<Entry> } = {};
    private graphics?: Phaser.GameObjects.Graphics;
    public stopPlayer = false;
    public player?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    private levelConfigKey: string = "";
    private levelMapKey: string = "";
    private map?: Phaser.Tilemaps.Tilemap;
    private storePoint?: number;

    create(data?: GatewayEntry | LoadEntry) {
        this.startWorld(data);
    }

    preload() {
        this.levelConfigKey = `/generated/config${this.scene.key}/level.json`;
        this.levelMapKey = `/assets${this.scene.key}/map.json`;
        this.load.json(this.levelConfigKey, this.levelConfigKey);
        this.load.json(this.levelMapKey, this.levelMapKey);
    }

    addEntry(entry: LayerObject<Entry>) {
        this.entries[entry.props.name] = entry;
    }

    getEntry(name: string = "main") {
        return this.entries[name] || this.entries["main"] || { x: 100, y: 100 };
    }

    mustRestart(data?: WorldEntryParameter) {
        if (data?.type == "battle") {
            return false;
        }
        const loadedStorePoint =
            DragonQuest.instance.storePointManager.loadedStorePoint;
        if (this.storePoint !== loadedStorePoint) {
            this.storePoint = loadedStorePoint;
            this.scene.restart(data);
            return true;
        }
        return false;
    }

    startWorld(data?: GatewayEntry | LoadEntry) {
        if (this.mustRestart(data)) return;
        const worldUiScene = this.scene.get("WorldUiScene");
        if (!worldUiScene || !this.scene.isActive("WorldUiScene")) {
            this.scene.launch("WorldUiScene", { world: this.scene.key });
        } else {
            this.scene.bringToTop(worldUiScene);
        }

        if (this.scene.isSleeping("WorldUiScene")) {
            this.scene.wake("WorldUiScene");
        }

        this.entries = {};
        // initDragonQuest()
        this.graphics = this.add.graphics();

        //this.events.on("wake", this.wake, this);

        //  animation with key 'left', we don't need left and right as we will use one and flip the sprite
        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("player", {
                frames: [1, 7, 1, 13],
            }),
            frameRate: 10,
            repeat: -1,
        });

        // animation with key 'right'
        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("player", {
                frames: [1, 7, 1, 13],
            }),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: "up",
            frames: this.anims.generateFrameNumbers("player", {
                frames: [2, 8, 2, 14],
            }),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: "down",
            frames: this.anims.generateFrameNumbers("player", {
                frames: [0, 6, 0, 12],
            }),
            frameRate: 10,
            repeat: -1,
        });

        // our player sprite created through the physics system
        this.player = this.physics.add.sprite(100, 100, "player", 6);
        this.player.setSize(9, 3);
        this.player.setOffset(4, 13);

        this.player.scaleX = 2;
        this.player.scaleY = 2;

        const smallmap = new TileLayerFactory(this.levelMapKey, this);

        const levelConfig = this.cache.json.get(this.levelConfigKey);
        DragonQuest.instance.setLevel(this.scene.key, levelConfig);

        //smallmap.actions["item"] = ItemAction;
        smallmap.actions["Monster"] = MonsterAction;
        smallmap.actions["npc"] = CharacterAction;
        smallmap.actions["Entry"] = EntryAction;
        smallmap.actions["Dialog"] = DialogAction;
        smallmap.actions["Loot"] = ChestAction;
        smallmap.actions["ObstacleObject"] = ObstacleAction;
        //smallmap.actions["discovery"] = DiscoveryAction;
        Object.keys(dragonQuestConfiguration.actions).forEach(
            (key) =>
                (smallmap.actions[key] = dragonQuestConfiguration.actions[key])
        );

        smallmap.layerActions["gold"] = PickUpAction(
            "VX Scenery Tileset",
            [100, 101],
            (player, gold) => {
                if (gold.active) {
                    (gold as Phaser.Physics.Arcade.Sprite).visible = false;
                    gold.active = false;
                    DragonQuest.instance.inventory.foundGold(10);
                }
            }
        );
        smallmap.layerActions["food"] = PickUpAction(
            "VX Scenery Tileset",
            [162, 163, 164, 165],
            (player, gold) => {
                if (gold.active) {
                    (gold as Phaser.Physics.Arcade.Sprite).visible = false;
                    gold.active = false;
                    DragonQuest.instance.inventory.foundFood(10);
                }
            }
        );

        //smallmap.actions["door"] = DoorAction;
        //smallmap.actions["Gateway"] = GatewayAction;

        const map = smallmap.create();
        this.map = map;
        // TODO bring above all layers that have prop abovePlayer:false
        this.children.bringToTop(this.player);
        this.children.bringToTop(this.graphics);

        // don't go out of the map
        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;
        this.player.setCollideWorldBounds(true);

        // limit camera to map
        this.cameras.main.setBounds(
            0,
            0,
            map.widthInPixels,
            map.heightInPixels
        );
        this.cameras.main.startFollow(this.player);
        this.cameras.main.roundPixels = true; // avoid tile bleed

        // user input
        this.cursors = this.input.keyboard?.createCursorKeys();
        this.input.keyboard?.on("keydown", this.onInventory, this);

        switch (data?.type) {
            case "load": {
                this.player.x = data.x;
                this.player.y = data.y;
                break;
            }
            default: {
                const entry = this.getEntry(data?.entry);
                this.player.x = entry.x;
                this.player.y = entry.y;
            }
        }

        this.player.body.setVelocity(0);
        DragonQuest.instance.events.dialog.start.on(() => {
            this.stopPlayer = true;
        });
        DragonQuest.instance.events.dialog.end.on(() => {
            this.stopPlayer = false;
            if (!this.player || !this.cursors) {
                return;
            }
            this.player.body.setVelocity(0);
            this.cursors.right.reset();
            this.cursors.left.reset();
            this.cursors.up.reset();
            this.cursors.down.reset();
        });

        this.game.events.on(
            "LoadGame",
            (data: {
                x: number;
                y: number;
                scene: string;
                allLevels: string[];
            }) => {
                this.scene.sleep();

                if (this.scene.isSleeping("LoadGame")) {
                    this.scene.wake("LoadGame", data);
                } else {
                    this.scene.launch("LoadGame", data);
                }
            }
        );
    }

    onInventory(event: KeyboardEvent) {
        if (event.code === "KeyI") {
            this.scene.sleep();
            this.scene.sleep("WorldUiScene");
            SceneTransitions.inventory.transition(
                this,
                {
                    entryWorld: this.scene.key,
                },
                () => {
                    this.onWake();
                }
            );
        }
    }

    update(time: number, delta: number) {
        //    this.controls.update(delta);
        if (!this.cursors || !this.player) {
            return;
        }

        if (this.stopPlayer) {
            this.player.body.setVelocity(0);
            this.player.anims.stop();
            return;
        }

        this.player.body.setVelocity(0);

        // Horizontal movement
        if (this.cursors.left.isDown) {
            this.player.body.setVelocityX(-80);
        } else if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(80);
        }

        // Vertical movement
        if (this.cursors.up.isDown) {
            this.player.body.setVelocityY(-80);
        } else if (this.cursors.down.isDown) {
            this.player.body.setVelocityY(80);
        }

        // Update the animation last and give left/right animations precedence over up/down animations
        if (this.cursors.left.isDown) {
            this.player.anims.play("left", true);
            this.player.flipX = true;
        } else if (this.cursors.right.isDown) {
            this.player.anims.play("right", true);
            this.player.flipX = false;
        } else if (this.cursors.up.isDown) {
            this.player.anims.play("up", true);
        } else if (this.cursors.down.isDown) {
            this.player.anims.play("down", true);
        } else {
            this.player.anims.stop();
        }

        if (this.map) {
            const depth =
                (this.player.y - this.map.tileHeight / 2) / this.map.tileHeight;

            this.player.depth = depth;
        }

        DragonQuest.instance.updatePlayerPosition(
            this.scene.key,
            this.player.x,
            this.player.y
        );
    }

    onWake(data?: WorldEntryParameter) {
        if (!this.player || !this.cursors) {
            return;
        }

        if (this.mustRestart(data)) return;
        if (this.scene.isSleeping("WorldUiScene")) {
            this.scene.wake("WorldUiScene");
        }

        // move player a way from possibley alive enemies
        if (data && data.type == "battle" && !data.win) {
            DragonQuest.instance.storePointManager.loadLastStorePoint();
            // this is necessary to not start battle again. Better would be to remove those while loading.
            const pos = DragonQuest.instance.getLastSafePlayerPosition();
            this.player.x = pos.x;
            this.player.y = pos.y;
        } else if (data && data.type == "gateway" && data.entry) {
            const entry = this.entries[data.entry];
            this.player.x = entry.x;
            this.player.y = entry.y;
        } else if (data && data.type == "load") {
            this.player.x = data.x;
            this.player.y = data.y;
        }
        this.player.body.setVelocity(0);
        this.cursors.right.reset();
        this.cursors.left.reset();
        this.cursors.up.reset();
        this.cursors.down.reset();
    }
}
