import { DragonQuest } from "../hub/DragonQuest";
import MonsterActionState from "./MonsterActionState";
import * as Phaser from "phaser";
import { Action } from "../worldaction/Action";
import { Monster } from "../../../generated/tiled-types/Monster";

export const MonsterAction: Action<Monster> = (layerObject, scene) => {
    const player = scene.player;
    if (!player) {
        return;
    }
    const monsters: Phaser.GameObjects.Sprite[] = [];
    const monsterName = layerObject.props.name;

    const monsterUnits = DragonQuest.instance.levelManager.createVillains(monsterName);
    let platform;
    let monsterCoords = { x: layerObject.x, y: layerObject.y };
    if (layerObject.width) {
        platform = new Phaser.GameObjects.Rectangle(
            scene,
            layerObject.x + layerObject.width / 2,
            layerObject.y + layerObject.height / 2,
            layerObject.width,
            layerObject.height,
            13123
        );
        monsterCoords = {
            x: layerObject.x + layerObject.width / 2,
            y: layerObject.y + layerObject.height / 2,
        };
        scene.physics.add.existing(platform);
    }

    if (monsterUnits && monsterUnits.length > 0) {
        const container = scene.physics.add.group();

        monsterUnits.forEach((monster, idx) => {
            const sprite = scene.make.sprite({
                x: monsterCoords.x + Math.round(idx * 30),
                y: monsterCoords.y + Math.round(idx * 5),
                key: monster.image,
            });
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
            state.onMeetEnemy(player, monster, monsterUnits, monsterName);
        }) as unknown as ArcadePhysicsCallback);
    });
    if (platform) {
        scene.physics.add.overlap(player, platform, ((
            player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
            monster: Phaser.GameObjects.Sprite
        ) => {
            state.onMeetEnemy(player, monster, monsterUnits, monsterName);
        }) as unknown as ArcadePhysicsCallback);
    }
};
