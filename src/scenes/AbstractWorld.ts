import * as Phaser from "phaser";
import { DragonQuest } from "../gameplay/DragonQuest";
import TileLayerFactory from "../tile/TileLayerFactory";
import { PickUpAction } from "../gameplay/worldaction/PickupAction";
//import { DoorAction } from "../gameplay/worldaction/DoorAction";
//import { GatewayAction } from "../gameplay/worldaction/GatewayAction";
import { MonsterAction } from "../gameplay/worldaction/MonsterAction";
import { EntryAction } from "../gameplay/worldaction/EntryAction";
import { CharacterAction } from "../gameplay/worldaction/CharacterAction";
//import { ItemAction } from "../gameplay/worldaction/ItemAction";
import { LayerObject } from "../gameplay/worldaction/LayerObject";

export class AbstractWorld extends Phaser.Scene {
    private entries: { [key: string]: LayerObject } = {};
    private graphics?: Phaser.GameObjects.Graphics;
    private stopPlayer = false;
    public player?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    preload() {}

    addEntry(layerObject: LayerObject) {
        this.entries[layerObject.name] = layerObject;
    }

    getMainEntry() {
        return this.entries["main"] || { x: 100, y: 100 };
    }

    startWorld(mapName: string, x: number, y: number) {
        this.entries = {};
        // initDragonQuest()
        this.graphics = this.add.graphics();

        this.events.on("wake", this.wake, this);

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
        this.player.scaleX = 2;
        this.player.scaleY = 2;

        const smallmap = new TileLayerFactory(mapName, this);

        //smallmap.actions["item"] = ItemAction;
        smallmap.actions["monster"] = MonsterAction;
        smallmap.actions["npc"] = CharacterAction;
        smallmap.actions["entry"] = EntryAction;
        //smallmap.actions["discovery"] = DiscoveryAction;

        smallmap.layerActions["gold"] = PickUpAction(
            "VX Scenery Tileset",
            [100, 101],
            (player, gold) => {
                if (gold.active) {
                    (gold as Phaser.Physics.Arcade.Sprite).visible = false;
                    gold.active = false;
                    DragonQuest.foundGold(10);
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
                    DragonQuest.foundFood(10);
                }
            }
        );

        //smallmap.actions["door"] = DoorAction;
        //smallmap.actions["gateway"] = GatewayAction;

        const map = smallmap.create();
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
        this.cursors = this.input.keyboard.createCursorKeys();
        this.input.keyboard.on("keydown", this.onInventory, this);

        const entry = this.getMainEntry();
        this.player.x = entry.x;
        this.player.y = entry.y;

        this.player.body.setVelocity(0);
    }

    onInventory(event: KeyboardEvent) {
        if (event.code === "KeyI") {
            this.scene.sleep();
            if (this.scene.isSleeping("InventoryScene")) {
                this.scene.wake("InventoryScene", {
                    entryWorld: this.scene.key,
                });
            } else {
                this.scene.launch("InventoryScene", {
                    entryWorld: this.scene.key,
                });
            }
        }
    }

    update(time: number, delta: number) {
        //    this.controls.update(delta);
        if (!this.cursors || !this.player || this.stopPlayer) {
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
    }

    wake(sys: any, data: any) {
        if (!this.player || !this.cursors) {
            return;
        }
        // move player away from possibley alive enemies
        if (data && data.battleFinished) {
            this.player.x = this.player.x + 100;
        } else {
            const entry = this.getMainEntry();
            this.player.x = entry.x;
            this.player.y = entry.y;
        }
        this.player.body.setVelocity(0);
        this.cursors.right.reset();
        this.cursors.left.reset();
        this.cursors.up.reset();
        this.cursors.down.reset();
    }
}
