import { DropItem } from "./DropItem";
import { Power } from "./Power";
import { Weapon } from "./Weapon";

export interface Character {
    name: string;
    armor: number;
    image: string;
    maxHp: number;
    attacks: Power[];
    dropItems?: DropItem[];
}
