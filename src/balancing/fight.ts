import { Character } from "../gameplay/types/Character";
import { Unit } from "../sprites/Unit";

export interface AttackResult {
    attack: string;
    targetName: string;
}
export interface Result {
    rounds: number;
    outcome: "hero" | "tied" | "enemy";
    totalHp: number;
    totalMaxHp: number;
    survivorCount: number;
    totalWinnerCount: number;
    attackEfficiencies: AttackEfficiency[];
}
export interface AttackEfficiency extends AttackResult {
    efficiency: number;
}
export type chooseAttacks = (
    h: Unit,
    opponents: Unit[],
    friends: Unit[]
) => AttackResult;

export const fight = (
    enemies: Character[],
    heroes: Character[],
    chooseAttack: chooseAttacks
): Result => {
    const enemyUnits = enemies.map((e) => new Unit(e));
    const heroUnits = heroes.map((e) => new Unit(e));
    let rounds = 0;
    const attackEfficiencies: AttackEfficiency[] = [];
    while (isAlive(enemyUnits) && isAlive(heroUnits) && rounds < 20) {
        rounds++;
        heroUnits
            .filter((h) => h.alive)
            .map((h) => {
                const hp1 = getTotal(enemyUnits, (unit) => unit.hp);
                const result = chooseAttack(
                    h,
                    enemyUnits.filter((e) => e.alive),
                    heroUnits.filter((h1) => h1 !== h)
                );
                const hp2 = getTotal(enemyUnits, (unit) => unit.hp);
                return {
                    attack: result.attack,
                    targetName: result.targetName,
                    efficiency: hp2 < hp1 ? 1 : 0,
                };
            })
            .forEach((a) => attackEfficiencies.push(a));

        enemyUnits
            .filter((h) => h.alive)
            .forEach((h) => {
                chooseAttack(
                    h,
                    heroUnits.filter((h) => h.alive),
                    enemyUnits.filter((h1) => h1 !== h)
                );
            });
    }

    const winnerUnits = isAlive(heroUnits) ? heroUnits : enemyUnits;
    const outcome =
        isAlive(heroUnits) && isAlive(enemyUnits)
            ? "tied"
            : isAlive(heroUnits)
            ? "hero"
            : "enemy";

    return {
        rounds,
        outcome,
        totalHp: winnerUnits.reduce((acc, prev) => {
            acc += prev.hp;
            return acc;
        }, 0),
        totalMaxHp: winnerUnits.reduce((acc, prev) => {
            acc += prev.maxHp;
            return acc;
        }, 0),
        survivorCount: winnerUnits.filter((h) => h.alive).length,
        totalWinnerCount: winnerUnits.length,
        attackEfficiencies,
    };
};
function isAlive(units: Unit[]) {
    return units.filter((u) => u.alive).length > 0;
}

function getTotal(units: Unit[], cb: (unit: Unit) => number) {
    return units
        .filter((unit) => unit.alive)
        .reduce((acc, prev) => {
            acc += cb(prev);
            return acc;
        }, 0);
}
