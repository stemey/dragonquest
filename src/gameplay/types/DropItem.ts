import { Healing } from "./Healing";
import { Weapon } from "./Weapon";

export interface Gold {
    type: "gold";
    amount: number;
}
export interface Key {
    type: "key";
    name: string;
    description: string;
    image: string;
}
export type DropItem = Key | Weapon | Healing;
