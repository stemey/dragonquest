import { IObservableValue, observable, ObservableMap } from "mobx";
import { DropItem } from "./types/DropItem";
import { Unit } from "../sprites/Unit";
import { Level } from "./types/Level";
import { Characters } from "./types/Characters";
import { Powers } from "./types/Powers";
import { DropItemRef } from "./types/Character";

class DragonQuestType {
    goldCount: IObservableValue<number> = observable.box(0);
    items: ObservableMap<string, DropItem> = observable.map({});
    private levels: { [key: string]: Level } = {};
    public currentLevelKey = "";
    public heroes: Unit[] = [];
    private characters: Characters = {};
    private powers: Powers = {};

    init(characters: Characters, powers: Powers) {
        this.characters = characters;
        this.powers = powers;
        this.heroes = Object.values(this.characters).filter(c => c.hero).map(h => new Unit(h)) 
    }

    createVillainByName(name: string) {
        return new Unit(this.characters[name]);
    }

    private get currentLevel() {
        return this.levels[this.currentLevelKey];
    }

    getDialog(name: string) {
        return this.currentLevel.dialogs[name];
    }

    setLevel(key: string, level: Level) {
        this.levels[key] = level;
    }

    foundGold(goldCount: number) {
        this.goldCount.set(this.goldCount.get() + goldCount);
        console.log("gold " + this.goldCount);
    }

    foundItem(item: DropItem) {
        this.items.set(item.name, item);
    }

    foundItems(itemRefs: DropItemRef[]) {
        // TODO number not taken into account especially for gold
        const items = itemRefs.map(
            (itemRef) => this.currentLevel.loots[itemRef.name]
        );
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
}

export const DragonQuest = new DragonQuestType();
(window as any).DragonQuest = DragonQuest;
