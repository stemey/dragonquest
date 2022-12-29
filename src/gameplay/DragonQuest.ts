import { IObservableValue, observable, ObservableMap } from "mobx";
import { DropItem } from "./types/DropItem";
import { Unit } from "../sprites/Unit";
import { Level } from "./types/Level";
import { Characters } from "./types/Characters";
import { Powers } from "./types/Powers";
import { DropItemRef } from "./types/DropItemRef";
import { CustomApi } from "./CustomApi";
import { Attack } from "./battle/Attack";
import { Heal } from "./battle/Heal";

export class DragonQuestType {
    goldCount: IObservableValue<number> = observable.box(0);
    items: ObservableMap<string, DropItem> = observable.map({});
    private levels: { [key: string]: Level } = {};
    public currentLevelKey = "";
    public heroes: Unit[] = [];
    private characters: Characters = {};
    private powers: Powers = {};
    api = new CustomApi(this);

    init(characters: Characters, powers: Powers) {
        this.characters = characters;
        this.powers = powers;
        this.heroes = []; //Object.values(this.characters).filter(c => c.hero).map(h => new Unit(h))
    }

    createVillainByName(name: string) {
        return new Unit(this.characters[name]);
    }

    createVillains(name: string) {
        const monsterIds = this.currentLevel.monsters[name];
        return monsterIds
            .map((id) => this.characters[id])
            .filter((c) => !!c)
            .map((c) => new Unit(c));
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
        const items = itemRefs.forEach((itemRef) => {
            if (itemRef.type === "gold") {
                this.foundGold(itemRef.amount);
            } else if (itemRef.type === "power") {
                const power = this.powers[itemRef.name];
                // TODO cannot add multiple potions. Which hero to add weapon to
                if (power.type === "healing") {
                    this.heroes[0].attacks.push(new Heal(power));
                } else {
                    this.heroes[0].attacks.push(new Attack(power));
                }
            }
        });
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

    addHero(name: string) {
        const hero = this.characters[name];
        this.heroes.push(new Unit(hero));
    }
}

export const DragonQuest = new DragonQuestType();
(window as any).DragonQuest = DragonQuest;
