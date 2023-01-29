import { Unit } from "../../../../sprites/Unit";
import { BattleModel } from "../BattleModel";
import { BattleUnit } from "../BattleUnit";
import { Target } from "../target";
import { enemy1, enemy2, weapon, knight } from "./fixtures";

const unit1 = new Unit(enemy1);
const unit2 = new Unit(enemy2);
const targets = [new Target(unit1), new Target(unit2)];
const hero = new Unit(knight);
describe("BattleUnit", () => {
    it("init", () => {
        const unit = new BattleUnit(hero, targets,new BattleModel());
        expect(unit.selected).toBeFalsy();
    });
    it("next", () => {
        const unit = new BattleUnit(hero, targets,new BattleModel());
        let atTheEnd = unit.next();
        expect(atTheEnd).toBeFalsy();
        expect(unit.powers[0].selected).toBeTruthy();
        atTheEnd = unit.next();
        expect(atTheEnd).toBeFalsy();
        expect(unit.powers[1].selected).toBeTruthy();
        atTheEnd = unit.next();
        expect(atTheEnd).toBeFalsy();
        expect(unit.potions[0].selected).toBeTruthy();
        atTheEnd = unit.next();
        atTheEnd = unit.next();
        atTheEnd = unit.next();
        expect(atTheEnd).toBeTruthy();
    });
    it("confirm", () => {
        const unit = new BattleUnit(hero, targets, new BattleModel());
        let atTheEnd = unit.next();
        expect(atTheEnd).toBeFalsy();
        expect(unit.powers[0].selected).toBeTruthy();
        atTheEnd = unit.next();
        expect(atTheEnd).toBeFalsy();
        expect(unit.powers[1].selected).toBeTruthy();
        unit.selectNext();
        unit.confirm();
        expect(unit.powers[1].selectedTarget).toBeDefined();
        unit.unconfirm();
        expect(unit.powers[1].selectedTarget).toBeUndefined();
    });
});
