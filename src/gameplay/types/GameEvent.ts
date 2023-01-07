import { LevelState } from "../hub/GameState";

export interface GameEvent {
    trigger: {
        levelState: Partial<LevelState>;
    };
    dialog: string;
}
