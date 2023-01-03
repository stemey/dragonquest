import {
    IObservableArray,
    IObservableValue,
    observable,
    ObservableMap,
} from "mobx";
import { DropItem } from "./types/DropItem";
import { Unit } from "../sprites/Unit";
import { Level } from "./types/Level";
import { Characters } from "./types/Characters";
import { Powers } from "./types/Powers";
import { DropItemRef } from "./types/DropItemRef";
import { CustomApi } from "./CustomApi";
import { Attack } from "./battle/Attack";
import { Heal } from "./battle/Heal";
import { Tilemaps } from "phaser";
interface Coordinate {
    x: number;
    y: number;
}

class PlayerState {
    scene: string = "";
    path: Coordinate[] = [];
    update(scene: string, x: number, y: number) {
        if (scene !== this.scene) {
            this.path = [];
            this.scene = scene;
        }
        const c = { x: Math.round(x), y: Math.round(y) };
        if (
            this.path.length === 0 ||
            (c.x !== this.path[0].x && c.y !== this.path[0].y)
        ) {
            this.path.splice(0, 0, c);
            while (this.path.length > 40) {
                this.path.pop();
            }
        }
    }
    getLastSafePlayerPosition() {
        const index = Math.min(10, this.path.length);
        return this.path[index];
    }
}

export class DragonQuestType {
    goldCount: IObservableValue<number> = observable.box(0);
    items: IObservableArray<DropItem> = observable.array([]);
    private levels: { [key: string]: Level } = {};
    public currentLevelKey = "";
    public heroes: Unit[] = [];
    private characters: Characters = {};
    private powers: Powers = {};
    api = new CustomApi(this);

    private playerState: PlayerState = new PlayerState();

    init(characters: Characters, powers: Powers) {
        this.characters = characters;
        this.powers = powers;
        this.heroes = []; //Object.values(this.characters).filter(c => c.hero).map(h => new Unit(h))
    }

    createVillainByName(name: string) {
        return new Unit(this.characters[name]);
    }

    getLastSafePlayerPosition() {
        return this.playerState.getLastSafePlayerPosition();
    }

    createVillains(name: string) {
        const monsterIds = this.currentLevel.monsters[name];
        return monsterIds
            .map((id) => this.characters[id])
            .filter((c) => !!c)
            .map((c) => new Unit(c));
    }

    public updatePlayerPosition(scene: string, x: number, y: number) {
        this.playerState?.update(scene, x, y);
    }

    private get currentLevel() {
        return this.levels[this.currentLevelKey];
    }
    getLoot(lootName: any): DropItemRef[] {
        return this.currentLevel.loots[lootName];
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

    foundItems(itemRefs: DropItemRef[]) {
        // TODO number not taken into account especially for gold
        itemRefs.forEach((itemRef) => {
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
                const item = this.powers[itemRef.name];
                if (item) {
                    this.items.push(item);
                }
            } else if (itemRef.type === "key") {
                this.items.push(itemRef);
            }
        });
    }

    foundFood(foodCount: number) {
        const foodShare = foodCount / Object.keys(this.heroes).length;
        Object.values(this.heroes).forEach((hero) => {
            hero.foundFood(foodShare);
        });
    }

    logInventory() {
        Array.from(this.items.values()).forEach((item) => {
            console.log(item.type);
        });
    }

    addHero(name: string) {
        const hero = this.characters[name];
        this.heroes.push(new Unit(hero));
    }
}

export const DragonQuest = new DragonQuestType();
(window as any).DragonQuest = DragonQuest;
