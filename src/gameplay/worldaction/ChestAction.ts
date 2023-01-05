import * as Phaser from "phaser";
import { Action } from "./Action";
import { DropItemRef } from "../types/DropItemRef";
import { DragonQuest } from "../DragonQuest";
import { Dialog } from "../types/Dialog";
import { AnyDropItemRef } from "../types/AnyDropItemRef";

export const ChestAction: Action = (layerObject, world) => {
    const lootName = layerObject.getProp("name") as any;
    const itemRefs: AnyDropItemRef[] = DragonQuest.getLoot(lootName);

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
                collided = true;
                chest.depth = 50;
                chestGame.setVelocityY(-3);
                chestGame.setAngularVelocity(0.01);
                chest.scale=0.5

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
                        const dropItemRefs = DragonQuest.foundItems(itemRefs);
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
                        world.events.emit("DialogStart", dialog);
                        world.events.on("DialogEnd", () => {
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
