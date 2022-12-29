import { Healing } from "./Healing";
import { Weapon } from "./Weapon";

export interface Gold  {
    name:string;
    type: "gold";
    amount: number;
}
export interface Key {
    type:"key";
    name: string;
    image: string;
}
export type DropItem = Gold | Key | Weapon | Healing;
