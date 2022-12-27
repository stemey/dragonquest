import { Weapon } from "./Weapon";

export interface BaseDropItem {
    type: "gold" | "weapon" | "key";
    name:string;
}

export interface Gold extends BaseDropItem {
    type: "gold";
    amount: number;
}
export interface WeaponDropItem extends BaseDropItem {
    type: "weapon";
    weapon: Weapon;
}

export interface KeyDropItem extends BaseDropItem {
    type: "key";
    key: Key;
}

export interface Key {
    name: string;
    image: string;
    id: string;
}
export type DropItem = Gold | WeaponDropItem | KeyDropItem;
