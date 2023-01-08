import { DragonQuest } from "./hub/DragonQuest";
import { BattleOutcome } from "./hub/GameState";
import { Dialog } from "./types/Dialog";

export class Event<T> {
    constructor(
        private readonly name: string,
        private type: "game" | "level"
    ) {}

    on(cb: (data: T) => void, ctx?: any): void {
        DragonQuest.instance.onEvent(this.type, this.name, cb, ctx);
    }
    emit(data: T): void {
        DragonQuest.instance.emitEvent(this.type, this.name, data);
    }
}

export const DragonEvents = {
    dialog: {
        start: new Event<Dialog | string>("DialogStart", "game"),
        end: new Event<void>("DialogEnd", "game"),
    },
    battle: {
        end: new Event<BattleOutcome>("BattleEnd", "game"),
    },
};
