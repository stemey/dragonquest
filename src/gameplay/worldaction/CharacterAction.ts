import { DragonQuest } from "../DragonQuest";
import * as Phaser from "phaser";
import { DialogState } from "../dialog/DialogState";
import { Action } from "./Action";

export const CharacterAction: Action<any> = (layerObject, world) => {
    const name = layerObject.getProp("name") as string;
    const characters = world.physics.add.group({
        classType: Phaser.GameObjects.Container,
    });
    //const npc = DragonQuest.getNpcByName(name);
    /*if (npc) {
        const sprite = world.make.sprite({
            x: layerObject.x,
            y: layerObject.y,
            key: ""//npc.image,
        });
        characters.add(sprite);
        sprite.scaleX = npc.scale || 1;
        sprite.scaleY = npc.scale || 1;
        if (npc.type === "dialog" && npc.dialog) {
            const state = new DialogState(npc.dialog);
            world.physics.add.overlap(
                world.player,
                sprite,
                state.resume,
                false,
                state
            );
        }
    }*/
};
