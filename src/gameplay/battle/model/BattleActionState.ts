import { observable, ObservableMap, runInAction } from "mobx";
import { MessageManager } from "../../MessageManager";
import { Attack } from "../Attack";
import { Heal } from "../Heal";
import { BattleUnit } from "./BattleUnit";
import { InteractiveSelectable } from "./InteractiveSelectable";
import { getSelected, next, previous } from "./select";
import { Target } from "./target";

export class BattleActionState implements InteractiveSelectable {
    execute(): void {
        const target = this.selectedTarget?.name;
        if (!target) {
            return;
        }
        const unit = this.battleUnit.battleModel.findUnitByName(target);
        if (!unit) {
            return;
        }
        this.action?.execute(
            new MessageManager(),
            unit.unit,
            this.battleUnit.unit,
            false
        );
    }
    constructor(
        private power: Heal | Attack,
        targets: Target[],
        public battleUnit: BattleUnit
    ) {
        this._name.set(power.name);
        this._description.set(power.description);
        const selectableTargets = targets.filter(t => power.isSelectable(t))
        this.targets = observable.array(selectableTargets);
    }

    _selectedTarget = observable.box<Target | undefined>();

    get selectedTarget() {
        return this._selectedTarget?.get();
    }

    confirm(): void {
        if (this.chosen.get()) {
            console.log(
                "target selected",
                this.name,
                getSelected(this.targets)?.name
            );
            this._selectedTarget.set(getSelected(this.targets));
        } else {
            console.log("weapon chosen");
            this.chosen.set(true);
        }
    }
    unconfirm(): void {
        if (this.chosen.get()) {
            console.log("remove selection", this.name);
            this.chosen.set(false);
            this.selectTarget(false);
            this._selectedTarget.set(undefined);
        }
    }
    next() {
        this.selectTarget(false);

        next(this.targets, true);
        const targetName = getSelected(this.targets)?.name;
        console.log("next target", this.name, targetName);
        this.selectTarget(true);
    }
    previous() {
        this.selectTarget(false);
        previous(this.targets, true);
        console.log(
            "previous target",
            this.name,
            getSelected(this.targets)?.name
        );
        this.selectTarget(true);
    }
    deselectAllTargets() {
        this.targets.forEach((t) => {
            const unit = this.battleUnit.battleModel.findUnitByName(t.name);
            if (unit) {
                const index = unit.targetedBy.indexOf(this);
                if (index >= 0) {
                    unit.targetedBy.splice(index, 1);
                }
            }
        });
    }

    deselectTarget(unit: BattleUnit) {
        const index = unit.targetedBy.indexOf(this);
        if (index >= 0) {
            unit.targetedBy.splice(index, 1);
        }
    }

    selectTarget(selected: boolean | BattleUnit) {
        let unit: BattleUnit | undefined;
        if (typeof selected == "boolean") {
            const targetName = getSelected(this.targets)?.name;

            if (targetName) {
                unit = this.battleUnit.battleModel.findUnitByName(targetName);
            }
        } else {
            unit = selected;
        }

        if (unit) {
            this.deselectAllTargets();
            const index = unit.targetedBy.indexOf(this);
            if (index >= 0) {
                unit.targetedBy.splice(index, 1);
                this._selectedTarget.set(undefined);
            } else {
                unit.targetedBy.push(this);
                this.targets.forEach((t) => {
                    if (t.name === unit?.name.get()) {
                        this._selectedTarget.set(t);
                    }
                });
            }
        }
    }

    _name = observable.box("");
    _selected = observable.box(false);
    chosen = observable.box(false);
    ready = observable.box(false);
    _description = observable.box("");
    targets: Target[];
    listen(cb: () => void): void {
        this._selected.observe(cb);
    }
    get selected() {
        return this._selected.get();
    }
    set selected(selected: boolean) {
        this._selected.set(selected);
        if (!this.selected) {
            if (!this._selectedTarget.get()) {
                this.selectTarget(false);
            }
        }
    }

    get name(): string {
        return this._name.get();
    }
    get description(): string {
        return this._description.get();
    }

    get disabled() {
        return false;
    }

    get action() {
        if (this._selectedTarget) {
            return this.power;
        }
        return undefined;
    }
}
