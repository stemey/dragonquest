import { Healing } from "./Healing";
import { Weapon } from "./Weapon";

export interface BasePower {
    name: string;
    type?: "heal";
}

export type Power = Weapon | Healing;
