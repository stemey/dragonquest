import { Dialog } from "./Dialog";
import { DropItem } from "./DropItem";

export interface Level {
    name: string;
    tiles: string;
    monsters: { [name: string]: string[] };
    dialogs: {
        [key: string]: Dialog;
    };
}
