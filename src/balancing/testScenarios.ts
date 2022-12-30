import { Character } from "../gameplay/types/Character";
import { AttackEfficiency, fight, Result } from "./fight";
import { chooseAttacksRandom } from "./chooseAttacksRandom";
import { Weapon } from "../gameplay/types/Weapon";

export const testScenarios = (heroes: Character[], enemies: Character[]) => {
    let result = fight(enemies, heroes, chooseAttacksRandom);
    let iterationCount = 0;
    do {
        iterationCount++;
        enemies = varyEnemyStats(enemies, result);
        result = fight(enemies, heroes, chooseAttacksRandom);
        if (
            result.outcome == "hero" &&
            result.rounds/(enemies.length) > 3
        ) {
            return enemies;
        }
    } while (iterationCount < 100);

    throw new Error("cannot find balancing");
};

function varyEnemyStats(previousEnemies: Character[], result: Result) {
    const makeBetter = result.outcome === "hero";
    const prolong = result.rounds < 3;
    const remainingHp =
        result.outcome === "tied" ? 0.1 : result.totalHp / result.totalMaxHp;

    const newEnemies = previousEnemies.map((e) => ({
        ...e,
        attacks: e.attacks.map((a) => {
            return varyAttack(
                a as Weapon,
                result.attackEfficiencies.filter((a) => a.attacker === e.name),
                makeBetter,
                remainingHp,
                prolong
            );
        }),
    }));
    newEnemies.forEach((e) => {
        e.armor += changeValue(makeBetter, remainingHp, e.armor);
        e.maxHp += changeValue(makeBetter, remainingHp, e.maxHp);
    });
    return newEnemies;
}

function varyAttack(
    weapon: Weapon,
    es: AttackEfficiency[],
    makeBetter: boolean,
    remainingHp: number,
    prolong: boolean
) {
    const efficiency =
        es.reduce((acc, prev) => {
            acc += prev.efficiency;
            return acc;
        }, 0) / es.length;
    const newWeapon = { ...weapon };

    if (efficiency === 0) {
        newWeapon.strength += Math.round(weapon.strength * 0.3) + 1;
    }

    if (makeBetter) {
        newWeapon.damage += Math.round(weapon.damage * remainingHp);
    }
   /* if (prolong) {
        newWeapon.damage += Math.round(weapon.damage * remainingHp);
    }*/
    return newWeapon;
}

function changeValue(makeBetter: boolean, factor: number, value: number) {
    return makeBetter ? (factor * value) / 2 : -(factor * value) / 2;
}
