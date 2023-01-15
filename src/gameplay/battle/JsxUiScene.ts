import * as Phaser from "phaser";
import { BattleUnit } from "./model/BattleUnit";
import characters from "../../config/global/characters.json";
import powers from "../../config/global/powers.json";
import { Unit } from "../../sprites/Unit";
import { Character } from "../types/Character";
import { Power } from "../types/Power";
import { ItemListSettings } from "./menu/ItemListSettings";
import { create, jsx, reconcile, render, wrapInGlobalState } from "@dragonquest/jsx/jsx-runtime";
import { Gui } from "./menu/Gui";
import { phaserJsxHelper } from "../../jsx/phaserJsxHelper";

export const SCENE_KEY = "JsxUiScene";

export class JsxUiScene extends Phaser.Scene {
    constructor() {
        super({ key: SCENE_KEY });
    }

    model?: BattleUnit;
    ui?: Phaser.GameObjects.GameObject;

    create() {
        const knight = characters.knight as Character;
        knight.attacks.push(powers.axe as Power);
        knight.attacks.push(powers["long sword"] as Power);
        knight.attacks.push(powers.fireball as Power);
        this.model = new BattleUnit(new Unit(knight), []);
        const config: ItemListSettings = {
            fontSize: "15",
            padding: { x: 20, y: 10 },
            textColor: 0xaa00,
            selectedBorderColor: 0xff00,
            width: 200,
            marginBetweenItems: 15,
        };

        const element = jsx(Gui, { units: [this.model] });
        this.ui = render(this, element,phaserJsxHelper);
        this.add.existing(this.ui);

        this.input.keyboard.on("keydown", this.onKeyInput, this);
    }

    onKeyInput(event: KeyboardEvent) {
        if (event.code === "ArrowUp") {
            this.model?.previous();
        } else if (event.code === "ArrowDown") {
            this.model?.next();
        }
        
        
    }
}
