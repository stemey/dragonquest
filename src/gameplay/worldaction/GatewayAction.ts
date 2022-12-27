import * as Phaser from "phaser";
import { Action } from "./Action";

const GatewayAction: Action = (layerObject, world) => {
    const target = layerObject.getProp("target") as string;
    const zone = new Phaser.GameObjects.Zone(world, layerObject.x,
        layerObject.y,
        layerObject.width,
        layerObject.height)
    const zones = world.physics.add.group([zone]);
    
    if (!world.player) {
        return;
    }
    world.physics.add.overlap(
        world.player,
        zone,
        (player, zone) => {
            world.scene.sleep();
            if (world.scene.isSleeping(target)) {
                world.scene.wake(target);
            } else {
                world.scene.launch(target);
            }
        },
        this
    );
};

export default GatewayAction;
