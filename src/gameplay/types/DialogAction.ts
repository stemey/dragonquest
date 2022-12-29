import { DropItemRef } from "./DropItemRef";
import { CustomAction } from "./CustomAction";

export interface DialogAction {
    items: DropItemRef[];
    customs: CustomAction[];
}