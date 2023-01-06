import { DropItemRef } from "./DropItemRef";
import { CustomAction } from "./CustomAction";

export interface DialogAction {
    /**
     *
     */
    items?: DropItemRef[];
    /**
     * custm actions invoked on CustomApi
     */
    customs?: CustomAction[];
    /**
     * these flags are set
     */
    levelFlags?: { [key: string]: boolean };
}
