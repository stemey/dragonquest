import { observable } from "mobx";
import { Unit } from "../../../sprites/Unit";
import { BattleUnit } from "./BattleUnit";
import { next, previous } from "./select";
import { Target } from "./target";

export class BattleModel {
    heroes = observable.array<BattleUnit>([]);
    enemies = observable.array<BattleUnit>([]);
    endTurn = observable.box(false);

    startBattle(heroes: Unit[], enemies: Unit[]) {
        this.heroes.clear();
        this.enemies.clear();
        const targets = heroes.concat(enemies).map((u) => new Target(u));
        heroes.forEach((h) => {
            this.heroes.push(new BattleUnit(h, targets));
        });
        enemies.forEach((h) => {
            this.enemies.push(new BattleUnit(h, targets));
        });
        this.heroes[0].selected = true;
    }

    get currentHero() {
        return this.heroes.find((hero) => hero.selected) || this.heroes[0];
    }

    up() {
        if (this.endTurn.get()) {
            this.endTurn.set(false);
            this.heroes[this.heroes.length - 1].next();
        }
        const atTheEnd = this.currentHero.previous();
        if (atTheEnd) {
            const atTheEndOfHeroes = previous(this.heroes, false);
            this.endTurn.set(true);
        }
    }
    down() {
        if (this.endTurn.get()) {
            this.endTurn.set(false);
            this.heroes[0].next();
        }
        const atTheEnd = this.currentHero.next();
        if (atTheEnd) {
            const atTheEndOfHeroes = next(this.heroes, false);
            this.endTurn.set(true);
        }
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
