import { Expression } from "./Dialog";
import { DropItemRef } from "./DropItemRef";

export interface ConditionalDropItemRef {
    condition: Expression;
    dropItemRefs: DropItemRef[];
}
