import { GameObjects } from "phaser";
import { AbstractWorld } from "../../scenes/AbstractWorld";
import { BattleEntry } from "../../scenes/WorldEntryParameter";
import { Unit } from "../../sprites/Unit";
import { DragonQuest } from "../hub/DragonQuest";
import { BattleOutcome } from "../hub/GameState";
import { SceneTransitions } from "../SceneTransitions";

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

        DragonQuest.instance.events.battle.end.on((data) => this.wake(data));

        SceneTransitions.battle.transition(
            this.scene,
            {
                enemies: enemies,
                entryWorld: this.scene.scene.key,
                enemyName,
            },
            (data: BattleEntry) => {
                this.scene.onWake(data);
            }
        );
    }

    wake(data: BattleOutcome) {
        //this.scene.scene.wake("WorldUiScene");
        if (data.heroWin) {
            this.monsters.forEach((sprite) => {
                sprite.destroy();
            });
        }
    }
}
