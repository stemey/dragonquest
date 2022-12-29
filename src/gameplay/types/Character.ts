import { Power } from "./Power";

export interface DropItemRef {
    name: string;
    count: number;
}

export interface Character {
    hero?:boolean;
    name: string;
    armor: number;
    image: string;
    maxHp: number;
    attacks: Power[];
    dropItems?: DropItemRef[];
}
