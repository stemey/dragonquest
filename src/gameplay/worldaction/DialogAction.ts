import * as Phaser from "phaser";
import { Action } from "./Action";

export const DialogAction: Action = (layerObject, world) => {
    const name = layerObject.getProp("name") as string;
    const zone = new Phaser.GameObjects.Zone(
        world,
        layerObject.x + layerObject.width / 2,
        layerObject.y + layerObject.height / 2,
        layerObject.width,
        layerObject.height
    );
    world.physics.add.group([zone]);

    if (!world.player) {
        return;
    }
    world.physics.add.overlap(
        world.player,
        zone,
        (player, zone) => {
            zone.destroy();
            world.events.emit("DialogStart", name);
        },
        this
    );
};
