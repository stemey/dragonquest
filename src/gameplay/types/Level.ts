import { AnyDropItemRef } from "./AnyDropItemRef";
import { Dialog } from "./Dialog";
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
