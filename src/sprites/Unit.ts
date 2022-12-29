import * as Phaser from "phaser";
import {Attack} from "../gameplay/battle/Attack";
import {Heal} from "../gameplay/battle/Heal";
import { Character } from "../gameplay/types/Character";
import { Healing } from "../gameplay/types/Healing";
import { Power } from "../gameplay/types/Power";

let unitId = 0;

/**
 * properties:
 * hp
 * armor
 * armor
 * maxHp
 * attacks:
 *    - name
 *    - healing
 *    - strength
 *    - magical?
 *    - damage
 */
export class Unit {
    public attacks: (Heal | Attack)[];
    public armor: number;
    public hp: number;
    public id:number;
    constructor(private character: Character) {
        this.armor = character.armor;
        this.hp = character.maxHp;
        this.id=unitId++;
        this.attacks = character.attacks.map((action) =>
            this.convertAction(action)
        );
    }

    convertAction(action: Power) {
        if (action.type && action.type === "healing") {
            return new Heal(action as Healing);
        } else {
            return new Attack(action);
        }
    }

    actionPerformed(successful: boolean, action: string) {}

    isHurt(strength: number) {
        return strength > this.armor;
    }

    heal(healing: number) {
        this.hp += healing;
        if (this.hp > this.character.maxHp) {
            this.hp = this.character.maxHp;
        }
    }

    takeDamage(damage: number) {
        this.hp -= damage;
        if (this.hp < 0) {
            this.hp = 0;
        }
    }

    foundFood(food: number) {
        this.heal(food);
    }

    get alive() {
        return this.hp > 0;
    }

    get image() {
        return this.character.image;
    }
    
    get maxHp() {
        return this.character.maxHp;
    }

    get name() {
        return this.character.name;
    }

   

    get dropItems() {
        return this.character.dropItems;
    }
}
