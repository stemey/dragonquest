import { Character } from "./Character";
import { Dialog } from "./Dialog";
import { DropItem } from "./DropItem";

export interface Level {
    name: string;
    tiles: string;
    loots: { [key: string]: DropItem };
    monsters: { [key: string]: Character[] };
    dialogs: {
        [key:string]:Dialog
    }
}
