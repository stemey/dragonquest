import { Character } from "../gameplay/types/Character";
import { Weapon } from "../gameplay/types/Weapon";
import { testScenarios } from "./testScenarios";

let characterId=0;

function character(
    props: { armor: number; maxHp: number },
    ...as: { damage: number; strength: number }[]
) {
    const attacks = as.map(
        (a, idx) =>
            ({
                name: "w" + idx,
                ...a,
                image: "",
                magical: false,
                type: "weapon",
            } as Weapon)
    );
    return {
        name: "c"+characterId++,
        attacks,
        ...props,
    } as Character;
}

describe("balance", () => {
    describe("1 vs 1", () => {
        const hero = character(
            { armor: 10, maxHp: 20 },
            { damage: 10, strength: 10 }
        );
        const heroes = [hero];
        it("equal", () => {
            const enemies = [
                character(
                    { armor: 10, maxHp: 20 },
                    { damage: 10, strength: 10 }
                ),
            ];
            const newEnemies = testScenarios(heroes, enemies);
            const newEnemy = newEnemies[0];
            const enemy = enemies[0];
            expect(newEnemy.armor).toBeLessThan(enemy.armor);
            expect(newEnemy.maxHp).toBeLessThan(enemy.maxHp);
            expect(newEnemy.armor).toBeLessThan(hero.armor);
            expect(newEnemy.maxHp).toBeLessThan(hero.maxHp);
        });
        it("vs weaker", () => {
            const enemies = [
                character(
                    { armor: 5, maxHp: 10 },
                    { damage: 10, strength: 10 }
                ),
            ];
            const newEnemies = testScenarios(heroes, enemies);
            const newEnemy = newEnemies[0];
            const enemy = enemies[0];
            expect(newEnemy.armor).toBeGreaterThan(enemy.armor);
            expect(newEnemy.maxHp).toBeGreaterThan(enemy.maxHp);
            expect(newEnemy.armor).toBeLessThan(hero.armor);
            expect(newEnemy.maxHp).toBeLessThan(hero.maxHp);
        });
        it("vs stronger", () => {
            const enemies = [
                character(
                    { armor: 15, maxHp: 25 },
                    { damage: 10, strength: 10 }
                ),
            ];
            const newEnemies = testScenarios(heroes, enemies);
            const newEnemy = newEnemies[0];
            const enemy = enemies[0];
            expect(newEnemy.armor).toBeLessThan(enemy.armor);
            expect(newEnemy.maxHp).toBeLessThan(enemy.maxHp);
            expect(newEnemy.armor).toBeLessThan(hero.armor);
            expect(newEnemy.maxHp).toBeLessThan(hero.maxHp);
        });
        it("vs better weapons", () => {
            const enemies = [
                character(
                    { armor: 15, maxHp: 25 },
                    { damage: 15, strength: 15 }
                ),
            ];
            const newEnemies = testScenarios(heroes, enemies);
            const newEnemy = newEnemies[0];
            const enemy = enemies[0];
            expect(newEnemy.armor).toBeLessThan(enemy.armor);
            expect(newEnemy.maxHp).toBeLessThan(enemy.maxHp);
            expect(newEnemy.armor).toBeLessThan(hero.armor);
            expect(newEnemy.maxHp).toBeLessThan(hero.maxHp);
        });
    });
    describe("1 vs 2", () => {
        const hero = character(
            { armor: 10, maxHp: 20 },
            { damage: 10, strength: 10 }
        );
        const heroes = [hero];
        it("same", () => {
            const enemies = [
                character(
                    { armor: 10, maxHp: 20 },
                    { damage: 10, strength: 10 }
                ),
                character(
                    { armor: 10, maxHp: 20 },
                    { damage: 10, strength: 10 }
                ),
            ];
            const newEnemies = testScenarios(heroes, enemies);

            expect(newEnemies[0].armor).toBeLessThan(enemies[0].armor);
            expect(newEnemies[0].maxHp).toBeLessThan(enemies[0].maxHp);
            expect(newEnemies[1].armor).toBeLessThan(enemies[1].armor);
            expect(newEnemies[1].maxHp).toBeLessThan(enemies[1].maxHp);
        });
    });
});
