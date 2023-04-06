import { initializeInstance } from "mobx/lib/internal";
import { Unit } from "../../sprites/Unit";
import { Attack } from "../battle/Attack";
import { Heal } from "../battle/Heal";
import { Characters } from "../types/Characters";
import { Powers } from "../types/Powers";
import { DragonQuestType } from "./DragonQuest";
import { Character } from "../types/Character";

export class GameManager {
    getHeroes(): Unit[] {
        return this.heroes;
    }
    powerFound(name: string) {
        const power = this.powers[name];
        // TODO cannot add multiple potions. Which hero to add weapon to
        if (power.type === "healing") {
            this.heroes[0].attacks.push(new Heal(power));
        } else {
            this.heroes[0].attacks.push(new Attack(power));
        }
        return power;
    }
    constructor(private readonly hub: DragonQuestType) {}

    init(characters: Characters, powers: Powers) {
        this.characters = characters;
        this.powers = powers;
        this.heroes = []; //Object.values(this.characters).filter(c => c.hero).map(h => new Unit(h))
    }

    public heroes: Unit[] = [];
    private characters: Characters = {};
    private powers: Powers = {};

    getHero() {
        return this.heroes[0];
    }

    createVillainByName(name: string) {
        return new Unit(this.characters[name]);
    }

    createVillains(monsterIds: string[]) {
        return monsterIds
            .map((id) => this.characters[id])
            .filter((c) => !!c)
            .reduce((units, current) => {
                let name = current.name;
                let index = 1;
                while (units.find((u) => u.name === name)) {
                    name = current.name + " " + index;
                    index++
                }

                const namedCharacter = { ...current, name };
                units.push(new Unit(namedCharacter));
                return units;
            }, [] as Unit[]);
    }

    foundFood(foodCount: number) {
        const foodShare = foodCount / Object.keys(this.heroes).length;
        Object.values(this.heroes).forEach((hero) => {
            hero.foundFood(foodShare);
        });
    }

    addHero(name: string) {
        const hero = this.characters[name];
        this.heroes.push(new Unit(hero));
        this.hub.onChanged();
    }
}
