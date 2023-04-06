import { Unit } from "../../sprites/Unit";
import { Healing } from "./Healing";
import { Weapon } from "./Weapon";

type PowerExecution = (targets: Unit[]) => void;

export interface BasePower {
    name: string;
    type: "healing" | "weapon";
    //target: Target;
    //execute(targets: Unit[]): void;
}

export interface Target {
    type: "opponent" | "friend";
    selection: "all" | "one" | "custom";
    selectionCount?: number;
}

export type Power = Weapon | Healing;
