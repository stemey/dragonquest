import { action, observable } from "mobx";
import { Unit } from "../../../sprites/Unit";
import { BattleUnit } from "./BattleUnit";
import { next, previous } from "./select";
import { Target } from "./target";
import { wait } from "./wait";

export class BattleModel {
    findUnitByName(targetName: string) {
        return this.heroes
            .concat(this.enemies)
            .find((u) => u.name.get() === targetName);
    }

    heroes = observable.array<BattleUnit>([]);
    enemies = observable.array<BattleUnit>([]);

    prepare = observable.box(true);

    startBattle(heroes: Unit[], enemies: Unit[]) {
        this.heroes.clear();
        this.enemies.clear();
        const targets = heroes
            .map((unit) => new Target(unit, false))
            .concat(enemies.map((unit) => new Target(unit, true)));
        heroes.forEach((h) => {
            this.heroes.push(new BattleUnit(h, targets, this));
        });
        enemies.forEach((h) => {
            this.enemies.push(
                new BattleUnit(
                    h,
                    targets.map((target) => target.reverse()),
                    this
                )
            );
        });
        this.heroes[0].selected = true;
        this.heroes.forEach((h) =>
            h.listen(() => {
                this.select(h);
            })
        );
    }

    async finishTurn() {
        this.prepare.set(false);
        this.heroes.forEach(h => h.deselect());
        for (const h of this.heroes.filter(h => h.unit.alive).slice()) {

            await h.executeAction(3000)
        }
        for (const e of this.enemies.filter(h => h.unit.alive).slice()) {
            await e.chosenAndExecuteAction(3000)
        }

        this.heroes.forEach((h) => h.newTurn());
        this.enemies.forEach((h) => h.newTurn());
        this.prepare.set(true);

    }

    get currentHero() {
        return this.heroes.find((hero) => hero.selected) || this.heroes[0];
    }
    select(h: BattleUnit) {
        if (!h.selected) {
            h._selected.set(true);
            this.heroes.filter((h2) => {
                if (h2 !== h) {
                    h2.deselect();
                }
            });
        }
    }

    get weaponSelected() {
        const hero = this.currentHero;
        if (!hero) {
            return undefined;
        }
        return hero.powers.find((a) => a.chosen && a.selected);
    }

    up() {
        /*  if (this.endTurn.get()) {
            this.endTurn.set(false);
            this.heroes[this.heroes.length - 1].next();
        }*/

        const atTheEnd = this.currentHero.previous();
        if (atTheEnd) {
            previous(this.heroes, true);
            this.currentHero.previous();
        }

        /* if (atTheEnd) {
            const atTheEndOfHeroes = previous(this.heroes, false);
            this.endTurn.set(true);
        }*/
    }
    down() {
        /* if (this.endTurn.get()) {
            this.endTurn.set(false);
            this.heroes[0].next();
        }*/
        const atTheEnd = this.currentHero.next();
        if (atTheEnd) {
            next(this.heroes, true);
            this.currentHero.next();
        }
        /*if (atTheEnd) {
            const atTheEndOfHeroes = next(this.heroes, false);
            this.endTurn.set(true);
        }*/
    }
    left() {
        this.currentHero.selectNext();
    }
    right() {
        this.currentHero.selectPrevious();
    }
    space() {
        this.currentHero.confirm();
    }
    get actions() {
        return this.heroes.flatMap((u) => u.actions);
    }
}
