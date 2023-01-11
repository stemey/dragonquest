import { observable, ObservableMap } from "mobx";
import { Attack } from "../Attack";
import { Heal } from "../Heal";
import { InteractiveSelectable } from "./InteractiveSelectable";
import { getSelected, next, previous } from "./select";
import { Target } from "./target";

export class BattleActionState implements InteractiveSelectable {
    constructor(private power: Heal | Attack, targets: Target[]) {
        this.name.set(power.name);
        this.description.set(power.description);
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
    name = observable.box("");
    _selected = observable.box(false);
    chosen = observable.box(false);
    ready = observable.box(false);
    description = observable.box("");
    targets: Target[];

    get selected() {
        return this._selected.get();
    }
    set selected(selected: boolean) {
        this._selected.set(selected);
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
