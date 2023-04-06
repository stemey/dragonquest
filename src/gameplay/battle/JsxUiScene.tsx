import * as Phaser from "phaser";
import { Unit } from "../../sprites/Unit";
import { render } from "@dragonquest/jsx/jsx-runtime";
import { Battle } from "./menu/Battle";
import { phaserJsxHelper } from "../../jsx/phaserJsxHelper";
import { BattleModel } from "./model/BattleModel";
import { runInAction } from "mobx";
import { BattleSceneParameter } from "./BattleScene";
import { BattleEntry } from "../../scenes/WorldEntryParameter";
import { SceneWithReversibleTransitions } from "../../scenes/SceneWithReversibleTransitions";
import { ReversibleData, SceneTransitions } from "../SceneTransitions";
import { DragonQuest } from "../hub/DragonQuest";

export const SCENE_KEY = "JsxUiScene";

export class JsxUiScene
    extends Phaser.Scene
    implements
        SceneWithReversibleTransitions<BattleSceneParameter, BattleEntry>
{
    constructor() {
        super({ key: SCENE_KEY });
    }

    battleModel = new BattleModel();
    ui?: Phaser.GameObjects.GameObject;
    reverse?: (data: BattleEntry) => void;

    onWake(data: ReversibleData<BattleSceneParameter, BattleEntry>) {
        this.reverse = data.reverse;

        /* this.battleModel.startBattle(
            DragonQuest.instance.gameManager.getHeroes(),
            data.data.enemies,
            data.data.enemyName
        );*/
        if (this.ui) {
            this.ui.destroy();
        }
        this.battleModel = new BattleModel();

        this.create(data);
    }

    create(data: ReversibleData<BattleSceneParameter, BattleEntry>) {
        SceneTransitions.battle.onWake(this, this.onWake, this);
        this.startBattle(data);
    }

    startBattle(data: ReversibleData<BattleSceneParameter, BattleEntry>) {
        this.reverse = data.reverse;

        if (data.data.enemies) {
            this.initBattleModel(data.data.enemies, data.data.enemyName);
        }

        this.ui = render(
            this,
            <Battle
                battleModel={this.battleModel}
                returnToWorld={() => {
                    if (!this.reverse) {
                        return;
                    }
                    const event = {
                        heroWin: this.battleModel.win,
                        deadEnemy: this.battleModel.enemyName || "",
                    };
                    ;// this removes the enemy sprites
                    DragonQuest.instance.gameState.finishedBattle(event);// this 
                    this.reverse({
                        type: "battle",
                        win: this.battleModel.win,
                    });
                }}
            />,
            phaserJsxHelper
        );
        if (this.ui) {
            this.add.existing(this.ui);
        }

        this.input.keyboard?.on("keydown", this.onKeyInput, this);
    }
    initBattleModel(enemies: Unit[], enemyName: string) {
        const heroes = DragonQuest.instance.gameManager.getHeroes();

        this.battleModel.startBattle(heroes, enemies, enemyName);
    }

    onKeyInput(event: KeyboardEvent) {
        runInAction(() => {
            if (event.code === "ArrowUp") {
                this.battleModel?.up();
            } else if (event.code === "ArrowDown") {
                this.battleModel?.down();
            } else if (event.code === "Space") {
                this.battleModel?.space();
            } else if (event.code === "ArrowLeft") {
                this.battleModel?.left();
            } else if (event.code === "ArrowRight") {
                this.battleModel?.right();
            }
        });
    }
}
