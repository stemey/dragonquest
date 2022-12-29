import { BasePower } from "./Power";

export interface Weapon extends BasePower {
    strength: number;
    damage: number;
    magical?: boolean;
    image?:string;
}
