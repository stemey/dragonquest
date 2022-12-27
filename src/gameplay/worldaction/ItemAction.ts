import { DragonQuest } from "../DragonQuest";
import { Action } from "./Action";
/*
const ItemAction:Action = (layerObject, world) => {
    const player = world.player;
    if (!player) {
        return;
    }
    const item = world.make.sprite({
        x: layerObject.x,
        y: layerObject.y,
        key: "scenery",
        frame: 200,
    });
    world.physics.add.existing(item);
    world.physics.add.overlap(
        player,
        item,
        (player, item) => {
            if (item.active) {
                item.visible = false;
                item.active = false;
                console.log(layerObject.getProp("message"));
                DragonQuest.foundItem(
                    layerObject.toItemJson()
                );
            }
        },
        this
    );
};

export default ItemAction;
*/
