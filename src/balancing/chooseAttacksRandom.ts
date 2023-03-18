import { chooseAttacks } from "./fight";
import { eventsMock } from "./eventsMock";

export const chooseAttacksRandom: chooseAttacks = (unit, enemies, friends) => {
    const attackIdx =
        Math.round(Math.random() * unit.attacks.length) % unit.attacks.length;
    const attack = unit.attacks[attackIdx];
    const enemyIdx =
        Math.round(Math.random() * enemies.length) % enemies.length;
    const target = enemies[enemyIdx];
    // attack.execute(eventsMock, unit, target, false);
    return { attack: attack.name, targetName: target.name };
};
