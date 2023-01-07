import * as Phaser from "phaser";
import { Gateway } from "../../../generated/tiled-types/Gateway";
import { AbstractWorld } from "../../scenes/AbstractWorld";
import { GatewayEntry } from "../../scenes/WorldEntryParameter";
import { Action } from "./Action";

const GatewayAction: Action<Gateway> = (layerObject, world) => {
    const entry = layerObject.props.entry || "main";
    const targetScene = "/level/" + layerObject.props.targetScene;
    const zone = new Phaser.GameObjects.Zone(
        world,
        layerObject.x + layerObject.width / 2,
        layerObject.y + layerObject.height / 2,
        layerObject.width,
        layerObject.height
    );
    world.physics.add.existing(zone, true);

    if (!world.player) {
        return;
    }
    world.physics.add.overlap(
        world.player,
        zone,
        (player, zone) => {
            if (!world.scene.get(targetScene)) {
                const newLevel = new AbstractWorld({
                    key: targetScene,
                    physics: { matter: {}, arcade: {} },
                });
                world.scene.add(targetScene, newLevel);
            }
            world.scene.sleep();
            if (world.scene.isSleeping(targetScene)) {
                world.scene.wake(targetScene, {
                    type: "gateway",
                    entry,
                } as GatewayEntry);
            } else {
                world.scene.launch(targetScene, {
                    type: "gateway",
                    entry,
                } as GatewayEntry);
            }
        },
        this
    );
};

export default GatewayAction;
