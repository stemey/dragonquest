import { GameObjects } from "phaser";
import { AbstractWorld } from "../../scenes/AbstractWorld";
import { Unit } from "../../sprites/Unit";

export default class MonsterActionState {
    constructor(
        private monsters: Phaser.GameObjects.Sprite[],
        private scene: AbstractWorld
    ) {
        this.scene.events.on("wake", this.wake, this);
    }

    onMeetEnemy(
        player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
        monster: GameObjects.Sprite,
        enemies: Unit[]
    ) {
        player.body.setVelocity(0);
        this.scene.scene.sleep();
        if (this.scene.scene.isSleeping("BattleScene")) {
            this.scene.scene.wake("BattleScene", {
                enemies: enemies,
                entryWorld: this.scene.scene.key,
            });
        } else {
            this.scene.scene.launch("BattleScene", {
                enemies: enemies,
                entryWorld: this.scene.scene.key,
            });
        }
    }

    wake(data: { deadEnemies: Unit[] }) {
        if (data.deadEnemies && data.deadEnemies.length > 0) {
            this.monsters
                .filter(
                    (sprite) =>
                        data.deadEnemies.filter(
                            (enemy) => (sprite as any).enemyId === enemy.id
                        ).length > 0
                )
                .forEach((sprite) => {
                    sprite.destroy();
                });
        }
    }
}
