import { Character } from "../gameplay/types/Character";
import { fight, Result } from "./fight";
import { chooseAttacksRandom } from "./chooseAttacksRandom";

export const testScenarios = (heroes: Character[], enemies: Character[]) => {
    let result = fight(enemies, heroes, chooseAttacksRandom);
    if (result.outcome === "hero") {
        do {
            const newEnemies = varyEnemyStats(enemies, result, true);
            const newResult = fight(newEnemies, heroes, chooseAttacksRandom);
            if (newResult.outcome !== result.outcome) {
                break;
            }
            enemies = newEnemies;
        } while (true);
    } else {
        do {
            const newEnemies = varyEnemyStats(enemies, result, false);
            const newResult = fight(newEnemies, heroes, chooseAttacksRandom);
            enemies = newEnemies;
            if (newResult.outcome !== result.outcome) {
                break;
            }
        } while (true);
    }
    return enemies;
};

function varyEnemyStats(
    previousEnemies: Character[],
    result: Result,
    makeBetter: boolean
) {
    const remainingHp =
        result.outcome === "tied" ? 0.1 : result.totalHp / result.totalMaxHp;
    const newEnemies = previousEnemies.map((e) => ({
        ...e,
        attacks: e.attacks.map((a) => ({ ...a })),
    }));
    newEnemies.forEach((e) => {
        e.armor += changeValue(makeBetter, remainingHp, e.armor);
        e.maxHp += changeValue(makeBetter, remainingHp, e.maxHp);
    });
    return newEnemies;
}

function changeValue(makeBetter: boolean, factor: number, value: number) {
    return makeBetter ? (factor * value) / 2 : -(factor * value) / 2;
}
