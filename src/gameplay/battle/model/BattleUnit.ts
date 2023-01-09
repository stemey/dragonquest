import { Unit } from "../../../sprites/Unit";
import { BattleActionState } from "./BattleActionState";

export class BattleUnit {
    name: string;
    hp:number;
    maxHp:number;
    potions: Potion[];
    effect: EffectState;
    powers: BattleActionState[];
    selectedOpponent: number;
    selected: boolean;
    melee:boolean;
    stats:Stats;

    constructor(unit: Unit) {}

    selectNext():boolean {
        return false if last attack
    }
    choose() {
        return false if last attack
    }
    attackChosen:boolean;// opponent can be chosen

}
