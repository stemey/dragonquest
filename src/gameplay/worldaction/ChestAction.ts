import * as Phaser from "phaser";
import { Action } from "./Action";
import { DragonQuest } from "../hub/DragonQuest";
import { Dialog } from "../types/Dialog";
import { AnyDropItemRef } from "../types/AnyDropItemRef";
import { Loot } from "../../../generated/tiled-types/Loot";

export const ChestAction: Action<Loot> = (layerObject, world) => {
    const lootName = layerObject.props.name;
    const itemRefs: AnyDropItemRef[] =
        DragonQuest.instance.levelManager.getLoot(lootName);

    const foundChests = DragonQuest.instance.storePointManager.getActionStates(
        "Gateway"
    ) as string[];
    if (foundChests.indexOf(lootName) >= 0) {
        return;
    }

    if (itemRefs && world.player) {
        const chest = world.make.sprite(
            {
                key: "VX Shop Tileset",
                x: layerObject.x,
                y: layerObject.y,
                frame: 216,
            },
            true
        );
        chest.alpha = 0;

        const platform = new Phaser.GameObjects.Rectangle(
            world,
            layerObject.x,
            layerObject.y + chest.getBounds().height + 11,
            100,
            50,
            13123
        );
        const zone = new Phaser.GameObjects.Rectangle(
            world,
            layerObject.x,
            layerObject.y,
            chest.getBounds().width,
            chest.getBounds().height,
            13123
        );
        world.physics.add.existing(zone);
        world.matter.add.gameObject(platform, { isStatic: true });
        const chestGame = world.matter.add.gameObject(
            chest
        ) as Phaser.Physics.Matter.Sprite;

        let collided = false;
        world.physics.add.overlap(
            world.player,
            zone,
            (player, zone) => {
                if (collided) {
                    return;
                }
                const dropItemRefs =
                    DragonQuest.instance.inventory.foundItems(itemRefs);
                if (dropItemRefs.length == 0) {
                    return;
                }
                collided = true;
                chest.depth = 50;
                chestGame.setVelocityY(-3);
                chestGame.setAngularVelocity(0.01);
                chest.scale = 0.5;

                world.add.tween({
                    targets: chest,
                    alpha: { value: 1, duration: 500, ease: "Power1" },
                    scale: { value: 0.8, duration: 500, ease: "Power1" },
                    onStart: () => {
                        world.stopPlayer = true;
                        world.player?.body.setVelocity(0);
                    },
                });
                world.time.addEvent({
                    delay: 1000,
                    callback: () => {
                        world.stopPlayer = false;
                        DragonQuest.instance.storePointManager.addActionState(
                            "Gateway",
                            lootName
                        );
                        const items = dropItemRefs
                            .map((i) => {
                                switch (i.type) {
                                    case "gold": {
                                        return `${i.amount} gold`;
                                    }
                                    default: {
                                        return `${i.name}`;
                                    }
                                }
                            })
                            .join("\n");
                        const dialog: Dialog = {
                            start: {
                                message: `You have found a chest with ${itemRefs.length} items:\n\n ${items}`,
                                next: "end",
                            },
                            end: {
                                end: true,
                            },
                        };
                        DragonQuest.instance.events.dialog.start.emit(dialog);
                        world.game.events.on("DialogEnd", () => {
                            chest.destroy();
                        });
                    },
                    callbackScope: this,
                });
            },
            this
        );
    }
};
