import { IObservableArray, IObservableValue, observable } from "mobx";
import { Storable } from "../../store/Storable";
import { DragonQuestType } from "../hub/DragonQuest";
import { evaluateExpression } from "../hub/evaluateExpression";
import { AnyDropItemRef } from "../types/AnyDropItemRef";
import { DropItem } from "../types/DropItem";
import { DropItemRef } from "../types/DropItemRef";

export class Inventory
    implements Storable<{ goldCount: number; items: DropItem[] }>
{
    removeAllItems() {
        this.items.clear();
    }
    constructor(private readonly hub: DragonQuestType) {}

    foundFood(amount: number) {
        this.hub.gameManager.foundFood(amount);
        this.hub.onChanged();
    }

    addItem(item: DropItem) {
        this.items.push(item);
    }

    foundGold(goldCount: number) {
        this.goldCount.set(this.goldCount.get() + goldCount);
        this.hub.onChanged();
    }

    foundItems(anyItemRefs: AnyDropItemRef[]) {
        // TODO number not taken into account especially for gold
        const itemRefs = anyItemRefs.reduce((refs, ref) => {
            if ("condition" in ref) {
                if (evaluateExpression(ref.condition)) {
                    refs = refs.concat(ref.dropItemRefs);
                }
            } else {
                refs.push(ref);
            }

            return refs;
        }, [] as DropItemRef[]);
        itemRefs.forEach((itemRef) => {
            if (itemRef.type === "gold") {
                this.foundGold(itemRef.amount);
            } else if (itemRef.type === "power") {
                const power = this.hub.gameManager.powerFound(itemRef.name);

                if (power) {
                    this.hub.inventory.addItem(power);
                }
            } else if (itemRef.type === "key") {
                this.addItem(itemRef);
            }
        });
        this.hub.onChanged();

        return itemRefs;
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
