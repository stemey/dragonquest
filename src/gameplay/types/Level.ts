import { Dialog } from "./Dialog";
import { DropItemRef } from "./DropItemRef";

export interface Level {
    name: string;
    tiles: string;
    monsters: { [name: string]: string[] };
    dialogs: {
        [key: string]: Dialog;
    };
    loots: { [key: string]: DropItemRef[] };
}
