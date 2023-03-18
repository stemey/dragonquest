import { observable, runInAction } from "mobx";
import { InteractiveSelectable } from "./InteractiveSelectable";

export class Potion implements InteractiveSelectable {
    constructor(public name: string, count: number) {
        this.count.set(count);
    }
    listen(cb: () => void): void {
        this._selected.observe(cb);
    }

    private _confirmed = observable.box(false);
    confirm(): void {
        this._confirmed.set(true);
    }
    unconfirm(): void {
        this._confirmed.set(false);
    }
    previous(): void {}
    next(): void {}
    _selected = observable.box(false);
    count = observable.box(0);

    get selected() {
        return this._selected.get();
    }
    set selected(selected: boolean) {
        this._selected.set(selected);
    }
    get disabled() {
        return false;
    }
}
