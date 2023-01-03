import * as Phaser from "phaser";
import { Action } from "./Action";
import { DropItemRef } from "../types/DropItemRef";
import { DragonQuest } from "../DragonQuest";

export const ChestAction: Action = (layerObject, world) => {
    const lootName = layerObject.getProp("name") as any;
    const itemRefs: DropItemRef[] = DragonQuest.getLoot(lootName);

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
        //world.add.existing(platform);
        world.matter.add.gameObject(platform, { isStatic: true });
        const chestGame = world.matter.add.gameObject(
            chest
        ) as Phaser.Physics.Matter.Sprite;
        //world.physics.add.existing(chest) as Phaser.Physics.Matter.Sprite;

        let collided = false;
        world.physics.add.overlap(
            world.player,
            zone,
            (player, zone) => {
                if (collided) {
                    return;
                }
                collided = true;
                const originalY = chest.y;
                chest.depth = 50;
                //chest.setY(chest.y - 50);
                chestGame.setVelocityY(-3);
                chestGame.setAngularVelocity(0.01);
                //chestGame.displayOriginY.gr
                chestGame.setIgnoreGravity(false);
                //chest.visible=true
                chestGame.on;

                world.add.tween({
                    targets: chest,
                    alpha: { value: 1, duration: 1000, ease: "Power1" },
                    //y: { value: originalY, duration: 5000, ease: "Power1" },
                    onStart: () => {
                        world.stopPlayer = true;
                        world.player?.body.setVelocity(0);
                    },
                }); //.to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);
                world.time.addEvent({
                    delay: 1000,
                    callback: () => {
                        world.stopPlayer = false;
                        DragonQuest.foundItems(itemRefs);
                        
                        chest.destroy();
                    },
                    callbackScope: this,
                });
            },
            this
        );
    }
};
