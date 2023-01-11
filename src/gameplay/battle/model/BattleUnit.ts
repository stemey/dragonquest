import { observable } from "mobx";
import { Unit } from "../../../sprites/Unit";
import { BattleActionState } from "./BattleActionState";
import { EffectState } from "./EffectState";
import { InteractiveSelectable } from "./InteractiveSelectable";
import { Potion } from "./Potion";
import { SelectableGroup } from "./SelectableGroup";
import { Stats } from "./Stats";
import { Target } from "./target";

export class BattleUnit implements InteractiveSelectable {
    name = observable.box("");
    hp = observable.box(0);
    maxHp = observable.box(0);
    potions: Potion[] = [
        new Potion("blue", 1),
        new Potion("red", 1),
        new Potion("green", 1),
    ];
    effect = new EffectState();
    powers = observable.array<BattleActionState>([]);
    _selected = observable.box(false);
    melee = observable.box(true);
    stats: Stats = new Stats();
    private selectableGroups: SelectableGroup[];

    constructor(unit: Unit, targets: Target[]) {
        this.name.set(unit.name);
        this.hp.set(unit.maxHp);
        this.maxHp.set(unit.maxHp);
        unit.attacks.map((a) => {
            this.powers.push(new BattleActionState(a, targets));
        });
        this.selectableGroups = [
            new SelectableGroup(this.powers),
            new SelectableGroup(this.potions),
        ];
    }

    get selectedGroup(): SelectableGroup | undefined {
        return this.selectableGroups.find((s) => s.selected);
    }

    get selected() {
        return this._selected.get();
    }

    set selected(selected: boolean) {
        this._selected.set(selected);
    }

    next() {
        const currentGroup = this.selectedGroup;
        if (!currentGroup) {
            this.selectableGroups[0].select();
            return false;
        }
        const atTheEnd = currentGroup.next();
        if (atTheEnd) {
            const index = this.selectableGroups.indexOf(currentGroup);
            let newIndex = index + 1;
            if (newIndex >= this.selectableGroups.length) {
                return true;
            }
            this.selectableGroups[newIndex].select();
        }
        return false;
    }
    previous() {
        const currentGroup = this.selectedGroup;
        if (!currentGroup) {
            this.selectableGroups[0].select();
            return false;
        }
        const atTheEnd = currentGroup.previous();
        if (atTheEnd) {
            const index = this.selectableGroups.indexOf(currentGroup);
            let newIndex = index - 1;
            if (index < 0) {
                return true;
            }
            this.selectableGroups[newIndex].select();
        }
        return false;
    }
    confirm() {
        this.selectedGroup?.confirm();
    }
    unconfirm() {
        this.selectedGroup?.unconfirm();
    }

    selectNext() {
        if (this.selectedGroup) {
            this.selectedGroup.selectNext();
        }
    }
    selectPrevious() {
        if (this.selectedGroup) {
            this.selectedGroup.selectPrevious();
        }
    }
    get disabled() {
        return false;
    }


    get actions() {
        return this.powers
            .map((p) => {
                return p.action;
            })
            .filter((a) => !!a);
    }
}
