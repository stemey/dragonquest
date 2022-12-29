import { CustomAction } from "./CustomAction";
import { DropItem } from "./DropItem";

export interface DialogAction {
    items: string[];
    customs: CustomAction[];
}