import * as Phaser from "phaser";
import { BattleUnit } from "./model/BattleUnit";
import { ObservableItemModel } from "./menu/ObservableItemModel";
import characters from "../../config/global/characters.json";
import powers from "../../config/global/powers.json";
import { Unit } from "../../sprites/Unit";
import { Character } from "../types/Character";
import { Power } from "../types/Power";
import { ItemListSettings } from "./menu/ItemListSettings";
import { BattleModel } from "./model/BattleModel";

export const SCENE_KEY = "TestUiScene";

export class TestUiScene extends Phaser.Scene {
    constructor() {
        super({ key: SCENE_KEY });
    }

    model?: BattleUnit;

    create() {
        const knight = characters.knight as Character;
        knight.attacks.push(powers.axe as Power);
        knight.attacks.push(powers["long sword"] as Power);
        this.model = new BattleUnit(new Unit(knight), [], new BattleModel());

        /*
        const powerItems: ObservableItemModel[] = this.model.powers.map((a) =>
            createItemProxy(a, { text: "description", selected: "selected" })
        );
        const powerList = new ItemList(this, 0, 0, config, { items:powerItems });
        this.add.existing(powerList);


        const potionItems: ObservableItemModel[] = this.model.powers.map((a) =>
            createItemProxy(a, { text: "description", selected: "selected" })
        );
        
        const potionList = new ItemList(this, 0, 0, config, { items:potionItems });
        this.add.existing(potionList);
*/
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
