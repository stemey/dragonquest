import * as Phaser from "phaser";
import { ObstacleObject } from "../../../generated/tiled-types/ObstacleObject";
import { Action } from "./Action";

export const ObstacleAction: Action<ObstacleObject> = (layerObject, world) => {
    const collide = layerObject.props.collide;

    if (collide && world.player) {
        const platform = new Phaser.GameObjects.Rectangle(
            world,
            layerObject.x + layerObject.width / 2,
            layerObject.y + layerObject.height / 2,
            layerObject.width,
            layerObject.height,
            13123
        );

        world.physics.add.existing(platform, true);

        world.physics.add.collider(world.player, platform);
    }
};
