import { BasePower } from "./Power";

export interface Weapon extends BasePower {
    type: "weapon";
    strength: number;
    damage: number;
    magical?: boolean;
    image?: string;
}
