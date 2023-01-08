import { DragonQuest } from "./hub/DragonQuest";
import { Dialog } from "./types/Dialog";


export class Event<T> {
    constructor(
        private readonly name: string,
        private type: "game" | "level"
    ) {}

    on(cb: (data: T) => void): void {
        DragonQuest.instance.onEvent(this.type, this.name, cb);
    }
    emit(data: T): void {
        DragonQuest.instance.emitEvent(this.type, this.name, data);
    }
}



export const DragonEvents = {
    dialog: {
        start: new Event<Dialog|string>("DialogStart","game"),
        end:new Event<void>("DialogEnd","game")
    }
}
