import * as Phaser from "phaser";
import { Dialog } from "../../../generated/tiled-types/Dialog";
import { DragonQuest } from "../hub/DragonQuest";
import { Action } from "./Action";

export const DialogAction: Action<Dialog> = (layerObject, world) => {
    const name = layerObject.props.name;

    if (
        (
            DragonQuest.instance.storePointManager.getActionStates(
                "Dialog"
            ) as string[]
        ).indexOf(name) >= 0
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
            DragonQuest.instance.events.dialog.start.emit(name);
            DragonQuest.instance.storePointManager.addActionState(
                "Dialog",
                name
            );
        },
        this
    );
};
