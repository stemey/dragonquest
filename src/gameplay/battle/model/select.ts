import { IObservableArray } from "mobx";
import { Selectable } from "./Selectable";

export const next = (selectables: Selectable[]|IObservableArray<Selectable>, cyclic: boolean) => {
    const selected = selectables.find((s) => s.selected);
    if (!selected) {
        selectables[0].selected = true;
        return false;
    }
    let index = selectables.indexOf(selected);
    if (index >= 0) {
        selectables[index].selected = false;
    }
    index++;
    if (index >= selectables.length) {
        if (cyclic) {
            index = 0;
        } else {
            return true;
        }
    }
    selectables[index].selected = true;
    return false;
};

export const getSelected = <T extends Selectable>(selectables: T[]|IObservableArray<T>) => {
    return selectables.find((s) => s.selected);
};

export const previous = (selectables: Selectable[]|IObservableArray<Selectable>, cyclic: boolean) => {
    const selected = selectables.find((s) => s.selected);
    if (!selected) {
        selectables[selectables.length-1].selected = true;
        return false;
    }
    let index = selectables.indexOf(selected);
    if (index >= 0) {
        selectables[index].selected = false;
    }
    index--;
    if (index < 0) {
        if (cyclic) {
            index = selectables.length - 1;
        } else {
            return true;
        }
    }
    selectables[index].selected = true;
    return false;
};
