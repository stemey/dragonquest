import { DragonQuest } from "../hub/DragonQuest";
import { DialogAction } from "../types/DialogAction";


export function executeAction(action: DialogAction) {
    if (action.customs) {
        action.customs.forEach((c) => {
            const methodName = c.method;
            if (methodName in DragonQuest.instance.api) {
                const method = (DragonQuest.instance.api as any)[c.method];
                if (typeof method === "function") {
                    method.apply(DragonQuest.instance.api, c.params);
                }
            }
        });
    }
    if (action.levelFlags) {
        DragonQuest.instance.updateLevelFlags(action.levelFlags);
    }
    if (action.items) {
        DragonQuest.instance.inventory.foundItems(action.items);
    }
}
