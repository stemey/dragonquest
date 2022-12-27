import { DragonQuest } from "../DragonQuest";
import MonsterActionState from "./MonsterActionState";
import * as Phaser from "phaser";
import { Action } from "./Action";

export const FoodAction: Action = (layerObject, scene) => {
    const player = scene.player;
    if (!player) {
        return;
    }
    const monsters: Phaser.GameObjects.Sprite[] = [];
    const monsterIds = layerObject.getListProp("monster");
    if (monsterIds) {
        const container = scene.physics.add.group({
            classType: Phaser.GameObjects.Container,
        });
        const enemies = monsterIds
            .map((id) => DragonQuest.getVillainByName(id))
            .filter((villain) => !!villain);

        monsterIds
            .filter((monsterId) => monsterId.length > 0)
            .forEach((monsterId, idx) => {
                const villain = DragonQuest.getVillainByName(monsterId);
                if (villain) {
                    const sprite = scene.make.sprite({
                        x: layerObject.x + Math.round(idx * 30),
                        y: layerObject.y + Math.round(idx * 5),
                        key: villain.image,
                    });
                    monsters.push(sprite);
                    container.add(sprite);
                    (sprite as any).enemies = enemies;
                    (sprite as any).enemyId = enemies[idx]?.id;
                } else {
                    console.error(`cannot find villain with name ${monsterId}`);
                }
            });
    }
    const state = new MonsterActionState(monsters, scene);
    monsters.forEach((child) => {
        scene.physics.add.overlap(player, child, state.onMeetEnemy as ArcadePhysicsCallback);
    });
};

