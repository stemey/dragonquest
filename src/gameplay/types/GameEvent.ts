import { LevelState } from "../GameState";

export interface GameEvent {
    trigger: {
        levelState: Partial<LevelState>;
    };
    dialog: string;
}
