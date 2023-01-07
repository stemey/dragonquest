import { IObservableArray, IObservableValue, observable } from "mobx";
import { Storable } from "../store/Storable";
import { DropItem } from "./types/DropItem";

export class Inventory
    implements Storable<{ goldCount: number; items: DropItem[] }>
{
    addItem(item: DropItem) {
        this.items.push(item);
    }
    foundGold(goldCount: number) {
        this.goldCount.set(this.goldCount.get() + goldCount);
    }
    hasItem(name: string): unknown {
        return (
            this.items.filter((i) => {
                if ("name" in i) {
                    return i.name === name;
                }
                return false;
            }).length > 0
        );
    }

    serialize(): { goldCount: number; items: DropItem[] } {
        return {
            goldCount: this.goldCount.get(),
            items: this.items.map((x) => ({ ...x })),
        };
    }
    deserialize(serializedData: {
        goldCount: number;
        items: DropItem[];
    }): void {
        this.goldCount.set(serializedData.goldCount);
        this.items.replace(serializedData.items);
    }

    goldCount: IObservableValue<number> = observable.box(0);
    items: IObservableArray<DropItem> = observable.array([]);
}
