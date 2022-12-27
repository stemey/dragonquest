import { characters } from "./character/characters";
import { IObservableValue, observable, ObservableMap } from "mobx";
import { Character } from "./character/Character";
import { DropItem } from "./character/DropItem";
import { Unit } from "../sprites/Unit";

class DragonQuestType {
    private villains: Unit[];
    public heroes: { [name: string]: Unit };
     goldCount: IObservableValue<number>;
     items: ObservableMap<string, DropItem>;
    constructor() {
        this.villains = characters.villains.map((v) => new Unit(v));
        this.heroes = {};
        this.goldCount = observable.box(0);
        this.items = observable.map({});

        Object.entries(characters.heroes).forEach(([key, value]) => {
            this.heroes[key] = new Unit(value);
        });
        //this.npc = characters.npc;

        //this.worldActionRegistry = {};
    }

    getVillainByName(name: string) {
        const filtered = Object.values(this.villains).filter(
            (villain, key) => villain.name === name
        );
        return filtered && filtered.length > 0 ? filtered[0] : undefined;
    }

    getNpcByName(name: string) {
        return null; //this.npc[name];
    }

    getVillainById(id: number) {
        const filtered = Object.values(this.villains).filter(
            (villain, key) => villain.id === id
        );
        return filtered && filtered.length > 0 ? filtered[0] : undefined;
    }

    foundGold(goldCount: number) {
        this.goldCount.set(this.goldCount.get() + goldCount);
        console.log("gold " + this.goldCount);
    }

    foundItem(item: DropItem) {
        this.items.set(item.name, item);
    }

    foundItems(items: DropItem[]) {
        items.forEach((item) => this.foundItem(item));
    }

    getItem(name: string) {
        return this.items.get(name);
    }

    hasItem(name: string) {
        return this.items.has(name);
    }

    foundFood(foodCount: number) {
        const foodShare = foodCount / Object.keys(this.heroes).length;
        Object.values(this.heroes).forEach((hero) => {
            hero.foundFood(foodShare);
        });
    }

    logInventory() {
        Array.from(this.items.values()).forEach((item) => {
            console.log(item.type + " " + item.name);
        });
    }

    getWorldAction() {
        /* if (object.properties) {
            const layerObject = new LayerObject(object);
            if (object.type) {
                return this.worldActionRegistry[object.type](
                    new LayerObject(object),
                    physics,
                    container,
                    scene
                );
            } else if (layerObject.getProp("monster")) {
                return this.worldActionRegistry["monster"](
                    new LayerObject(object),
                    physics,
                    container,
                    scene
                );
            } else {
                console.log("unknown action");
            }
        }*/
    }
}

export const DragonQuest = new DragonQuestType();
(window as any).DragonQuest = DragonQuest;
