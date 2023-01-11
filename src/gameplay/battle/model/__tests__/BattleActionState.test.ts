import { Unit } from "../../../../sprites/Unit";
import { Attack } from "../../Attack";
import { BattleActionState } from "../BattleActionState";
import { Target } from "../target";
import { enemy1, enemy2, weapon } from "./fixtures";

const unit1 = new Unit(enemy1);
const unit2 = new Unit(enemy2);
const targets = [new Target(unit1), new Target(unit2)];

describe("BattleActionState", () => {
    it("init", () => {
        const action = new BattleActionState(new Attack(weapon), targets);
        expect(action.selected).toBeFalsy();
        expect(action.targets[0].selected).toBeFalsy();
    });
    it("next", () => {
        const action = new BattleActionState(new Attack(weapon), targets);
        action.selected = true;
        action.next();
        expect(action.targets[0].selected).toBeTruthy();
        expect(action.targets[1].selected).toBeFalsy();
        action.next();
        expect(action.targets[0].selected).toBeFalsy();
        expect(action.targets[1].selected).toBeTruthy();
        action.next();
        expect(action.targets[0].selected).toBeTruthy();
        expect(action.targets[1].selected).toBeFalsy();
    });
    it("previous", () => {
        const action = new BattleActionState(new Attack(weapon), targets);
        action.selected = true;
        action.previous();
        expect(action.targets[0].selected).toBeFalsy();
        expect(action.targets[1].selected).toBeTruthy();
        action.previous();
        expect(action.targets[0].selected).toBeTruthy();
        expect(action.targets[1].selected).toBeFalsy();
        action.previous();
        expect(action.targets[0].selected).toBeFalsy();
        expect(action.targets[1].selected).toBeTruthy();
    });
    it("confirm", () => {
        const action = new BattleActionState(new Attack(weapon), targets);
        action.selected = true;
        action.next();
        action.confirm();
        expect(action.selectedTarget).toBe(targets[0]);
        action.next();
        action.confirm();
        expect(action.selectedTarget).toBe(targets[1]);
    });
});
