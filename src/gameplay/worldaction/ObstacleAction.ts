import * as Phaser from "phaser";
import { Action } from "./Action";
import { DropItemRef } from "../types/DropItemRef";
import { DragonQuest } from "../DragonQuest";
import { Dialog } from "../types/Dialog";

export const ObstacleAction: Action = (layerObject, world) => {
    const collide = layerObject.getProp("collide") as boolean;

    if (collide && world.player) {
        const platform = new Phaser.GameObjects.Rectangle(
            world,
            layerObject.x+layerObject.width/2,
            layerObject.y+layerObject.height/2,
            layerObject.width,
            layerObject.height,
            13123
        );

        world.physics.add.existing(platform);

        world.physics.add.collider(
            world.player,
            platform
        );
    }
};
