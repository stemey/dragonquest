import * as Phaser from "phaser";
import characters from "../../config/global/characters.json";
import powers from "../../config/global/powers.json";
import { Unit } from "../../sprites/Unit";
import { Character } from "../types/Character";
import { Power } from "../types/Power";
import { globalState, render } from "@dragonquest/jsx/jsx-runtime";
import { Gui } from "./menu/Gui";
import { phaserJsxHelper } from "../../jsx/phaserJsxHelper";
import { BattleModel } from "./model/BattleModel";
import { action, runInAction } from "mobx";

export const SCENE_KEY = "JsxUiScene";

export class JsxUiScene extends Phaser.Scene {
    constructor() {
        super({ key: SCENE_KEY });
    }

    model?: BattleModel;
    ui?: Phaser.GameObjects.GameObject;

    create() {
        const knight = characters.knight as Character;
        knight.attacks.push(powers.axe as Power);
        knight.attacks.push(powers["long sword"] as Power);
        knight.attacks.push(powers.fireball as Power);

        const wiz = characters.wizard as Character;
        wiz.attacks.push(powers.fireball as Power);
        wiz.attacks.push(powers.healing as Power);

        //this.model = new BattleUnit(new Unit(knight), []);
        this.model = new BattleModel();
        const heroes = [knight, wiz].map((h) => new Unit(h));
        const enemies = [
            characters.kiri,
            characters["green mage"],
            characters.rumps,
        ].map((h) => new Unit(h as any));
        this.model.startBattle(heroes, enemies);
        this.ui = render(
            this,
            <Gui battleModel={this.model} />,
            phaserJsxHelper
        );
        if (this.ui) {
            this.add.existing(this.ui);
        }


        this.input.keyboard.on("keydown", this.onKeyInput, this);
    }

    onKeyInput(event: KeyboardEvent) {
        runInAction(() => {
            if (event.code === "ArrowUp") {
                this.model?.up();
            } else if (event.code === "ArrowDown") {
                this.model?.down();
            } else if (event.code === "Space") {
                this.model?.space();
            } else if (event.code === "ArrowLeft") {
                this.model?.left();
            } else if (event.code === "ArrowRight") {
                this.model?.right();
            }
        });
    }
}
