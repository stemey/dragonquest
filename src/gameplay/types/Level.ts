import { Dialog } from "./Dialog";
import { DropItemRef } from "./DropItemRef";
import { GameEvent } from "./GameEvent";

export interface Level {
    name: string;
    tiles: string;
    monsters: { [name: string]: string[] };
    dialogs: {
        [key: string]: Dialog;
    };
    loots: { [key: string]: DropItemRef[] };
    events: { [name: string]: GameEvent };
}
