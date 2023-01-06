import { AnyDropItemRef } from "./AnyDropItemRef";
import { ConditionalDropItemRef } from "./ConditionalDropItemRef";
import { Dialog } from "./Dialog";
import { DropItemRef } from "./DropItemRef";
import { GameEvent } from "./GameEvent";

export interface Level {
    name: string;
    monsters: { [name: string]: string[] };
    dialogs: {
        [key: string]: Dialog;
    };
    loots: { [key: string]: AnyDropItemRef[] };
    events: { [name: string]: GameEvent };
}
