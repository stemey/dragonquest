import { GameObjects } from "phaser";
import { AbstractWorld } from "../../scenes/AbstractWorld";
import { Unit } from "../../sprites/Unit";
import { DragonQuest } from "../hub/DragonQuest";

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
        enemies: Unit[],
        enemyName: string
    ) {
        if (enemies.filter((e) => e.alive).length === 0) {
            return;
        }
        DragonQuest.instance.storePointManager.autoSave();
        player.body.setVelocity(0);
        this.scene.scene.sleep();
        this.scene.scene.sleep("WorldUiScene");
        this.scene.game.events.on("battleFinished", (data: any) =>
            this.wake(data)
        );
        if (this.scene.scene.isSleeping("BattleScene")) {
            this.scene.scene.wake("BattleScene", {
                enemies: enemies,
                entryWorld: this.scene.scene.key,
                enemyName,
            });
        } else {
            this.scene.scene.launch("BattleScene", {
                enemies: enemies,
                entryWorld: this.scene.scene.key,
                enemyName,
            });
        }
    }

    wake(data: { heroWin: boolean }) {
        if (data.heroWin) {
            this.monsters.forEach((sprite) => {
                sprite.destroy();
            });
        }
    }
}
