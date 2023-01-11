import { Character } from "../../../types/Character";
import { Weapon } from "../../../types/Weapon";

export const weapon: Weapon = {
    damage: 10,
    name: "sword",
    strength: 10,
    type: "weapon",
};
export const weapon2: Weapon = {
    damage: 10,
    name: "axe",
    strength: 10,
    type: "weapon",
};
export const knight:Character = {
    hero: true,
    name: "Knight",
    armor: 10,
    image: "knight",
    maxHp: 10,
    attacks: [weapon,weapon2],
    className: "Knight",
};
export const wizard = {
    hero: true,
    name: "Wizard",
    armor: 10,
    image: "mage",
    maxHp: 10,
    attacks: [],
    className: "Wizard",
};
export const enemy1: Character = {
    name: "Rumps1",
    image: "monster",
    armor: 12,
    maxHp: 30,
    attacks: [
        {
            type: "weapon",
            name: "claws",
            strength: 15,
            damage: 10,
        },
    ],
};
export const enemy2: Character = {
    name: "Rumps2",
    image: "monster",
    armor: 12,
    maxHp: 30,
    attacks: [
        {
            type: "weapon",
            name: "claws",
            strength: 15,
            damage: 10,
        },
    ],
};
