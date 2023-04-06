import { DropItemRef } from "./DropItemRef";
import { Power } from "./Power";

export interface Character {
    hero?: boolean;
    name: string;
    armor: number;
    image: string;
    maxHp: number;
    attacks: Power[];
    dropItems?: DropItemRef[];
    className?: "Knight" | "Wizard";
    baseColor?: string;
}
