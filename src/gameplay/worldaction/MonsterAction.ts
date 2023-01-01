import { DragonQuest } from "../DragonQuest";
import MonsterActionState from "./MonsterActionState";
import * as Phaser from "phaser";
import { Action } from "./Action";

export const MonsterAction: Action = (layerObject, scene) => {
    const player = scene.player;
    if (!player) {
        return;
    }
    const monsters: Phaser.GameObjects.Sprite[] = [];
    const monsterName = layerObject.getProp("name") as string;
    const monsterUnits = DragonQuest.createVillains(monsterName);

    if (monsterUnits && monsterUnits.length > 0) {
        const container = scene.physics.add.group();

        monsterUnits.forEach((monster, idx) => {
            const sprite = scene.make.sprite(
                {
                    x: layerObject.x + Math.round(idx * 30),
                    y: layerObject.y + Math.round(idx * 5),
                    key: monster.image,
                }
            );
            monsters.push(sprite);
            container.add(sprite, true);
            (sprite as any).enemies = monster;
            (sprite as any).enemyId = monster.id;
        });
    }
    const state = new MonsterActionState(monsters, scene);
    monsters.forEach((child) => {
        scene.physics.add.overlap(player, child, ((
            player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
            monster: Phaser.GameObjects.Sprite
        ) => {
            state.onMeetEnemy(player, monster, monsterUnits);
        }) as unknown as ArcadePhysicsCallback);
        scene.events.on(
            "battleFinished",
            (data: { deadEnemies: number[] }) => {
                if (data && data.deadEnemies) {
                    data.deadEnemies.forEach((enemy) => {
                        if ((child as any).enemyId === enemy) {
                            (child as any).destroy();
                        }
                    });
                }
            },
            this
        );
    });
};
