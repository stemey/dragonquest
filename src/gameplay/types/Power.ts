import { Healing } from "./Healing";
import { Weapon } from "./Weapon";

export interface BasePower {
    name: string;
    type: "healing"|"weapon";
}

export type Power = Weapon | Healing;
