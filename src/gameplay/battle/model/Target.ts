import { observable } from "mobx";
import { Unit } from "../../../sprites/Unit";
import { Selectable } from "./Selectable";

export class Target implements Selectable {
    reverse(): any {
        return new Target(this.unit, !this.opponent);
    }
    _selected = observable.box(false);
    _disabled = observable.box(false);

    constructor(private unit: Unit, public opponent: boolean) {}

    get name() {
        return this.unit.name;
    }

    get selected() {
        return this._selected.get();
    }
    set selected(selected: boolean) {
        this._selected.set(selected);
    }
    get disabled() {
        return this._disabled.get();
    }
    set disabled(disabled: boolean) {
        this._disabled.set(disabled);
    }
}
