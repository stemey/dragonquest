import * as Phaser from "phaser";
import { ItemList } from "./menu/ItemList";
import { BattleUnit } from "./model/BattleUnit";
import { ItemSettings } from "./menu/ItemSettings";
import { ObservableItemModel } from "./menu/ObservableItemModel";
import characters from "../../config/global/characters.json";
import powers from "../../config/global/powers.json";
import { Unit } from "../../sprites/Unit";
import { Character } from "../types/Character";
import { Power } from "../types/Power";
import { ItemListSettings } from "./menu/ItemListSettings";

export const SCENE_KEY = "TestUiScene";

const createItemProxy = <T extends object>(
    t: T,
    mapping: { text: string; selected: string }
): ObservableItemModel => {
    return new Proxy(t, {
        get(target, name) {
            if (name in mapping) {
                const field: any = (mapping as any)[name];
                if (field) {
                    return (t as any)[field];
                }
            }
            return (t as any)[name];
        },
    }) as any;
};

export class TestUiScene extends Phaser.Scene {
    constructor() {
        super({ key: SCENE_KEY });
    }

    model?: BattleUnit;

    create() {
        const knight = characters.knight as Character;
        knight.attacks.push(powers.axe as Power);
        knight.attacks.push(powers["long sword"] as Power);
        this.model = new BattleUnit(new Unit(knight), []);
        const config: ItemListSettings = {
            fontSize: "15",
            padding: { x: 20, y: 10 },
            textColor: 0xaa00,
            selectedBorderColor: 0xff00,
            width: 200,
            marginBetweenItems: 15,
        };

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
