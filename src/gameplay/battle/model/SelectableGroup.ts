import { observe, runInAction } from "mobx";
import { InteractiveSelectable } from "./InteractiveSelectable";
import { next, previous } from "./select";

export class SelectableGroup implements InteractiveSelectable {
    constructor(private selectables: InteractiveSelectable[]) {
        selectables.forEach((s, idx) => {
            s.listen(() => {
                if (s.selected) this.unselect(idx);
            });
        });
    }
    unselect(idx: number) {
        this.selectables.forEach((s, index) => {
            if (idx !== index) s.selected = false;
        });
    }

    get selected() {
        return this.selectables.some((s) => s.selected);
    }
    get current() {
        return this.selectables.find((s) => s.selected);
    }
    get selectedIndex() {
        const selectable = this.selectables.find((s) => s.selected);
        if (!selectable) {
            return -1;
        }
        return this.selectables.indexOf(selectable);
    }
    get disabled() {
        return this.selectables.every((s) => s.disabled);
    }
    deselect() {
        this.selectables.forEach((s) => (s.selected = false));
    }
    select(first: boolean) {
        if (!this.selected && this.selectables.length > 0) {
            const index = first ? 0 : this.selectables.length - 1;
            this.selectables[index].selected = true;
        }
    }
    selectNext() {
        if (this.current) {
            this.current.next();
        }
    }
    selectPrevious() {
        if (this.current) {
            this.current.previous();
        }
    }

    next() {
        return next(this.selectables, false);
    }
    previous() {
        return previous(this.selectables, false);
    }

    confirm() {
        this.selectables.forEach((s, idx) => {
            if (idx === this.selectedIndex) {
                s.confirm();
            } else {
                s.unconfirm();
            }
        });
    }
    unconfirm() {
        this.selectables.forEach((s) => {
            s.unconfirm();
        });
    }
    left() {
        this.selectables[this.selectedIndex].previous();
    }
    right() {
        this.selectables[this.selectedIndex].next();
    }
    listen(cb: () => void) {
        this.selectables.forEach((s) => s.listen(cb));
    }
}
