import { observable, ObservableMap } from "mobx";
import { Attack } from "../Attack";
import { Heal } from "../Heal";
import { InteractiveSelectable } from "./InteractiveSelectable";
import { getSelected, next, previous } from "./select";
import { Target } from "./target";

export class BattleActionState implements InteractiveSelectable {
    constructor(private power: Heal | Attack, targets: Target[]) {
        this._name.set(power.name);
        this._description.set(power.description);
        this.targets = observable.array(targets);
    }

    _selectedTarget= observable.box<Target|undefined>();

    get selectedTarget() {
        return this._selectedTarget?.get();
    }

    confirm(): void {
        this._selectedTarget.set(getSelected(this.targets));
    }
    unconfirm(): void {
        this._selectedTarget.set(undefined);
    }
    next() {
        return next(this.targets, true);
    }
    previous() {
        return previous(this.targets, true);
    }
    _name = observable.box("");
    _selected = observable.box(false);
    chosen = observable.box(false);
    ready = observable.box(false);
    _description = observable.box("");
    targets: Target[];

    get selected() {
        return this._selected.get();
    }
    set selected(selected: boolean) {
        this._selected.set(selected);
    }

    get name():string {
        return this._name.get();
    }
    get description():string {
        return this._description.get();
    }

    get disabled() {
        return false;
    }

    get action() {
        if (this._selectedTarget) {
            return this.power;
        }
        return undefined
    }
}
