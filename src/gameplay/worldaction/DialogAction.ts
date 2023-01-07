import * as Phaser from "phaser";
import { DragonQuest } from "../DragonQuest";
import { Action } from "./Action";

export const DialogAction: Action = (layerObject, world) => {
    const name = layerObject.getProp("name") as string;

    if (
        (DragonQuest.getActionStates("Dialog") as string[]).indexOf(name) >= 0
    ) {
        return;
    }

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
            world.game.events.emit("DialogStart", name);
            DragonQuest.addActionState("Dialog", name);
        },
        this
    );
};
