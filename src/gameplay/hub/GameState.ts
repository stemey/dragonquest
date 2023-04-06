import { Storable } from "../../store/Storable";
import { DragonQuestType } from "./DragonQuest";

export interface BattleOutcome {
    heroWin: boolean;
    deadEnemy: string;
}

export class GameState
    implements
        Storable<{ levels: { [key: string]: LevelState }; levelKey: string }>
{
    constructor(private readonly hub: DragonQuestType) {}

    serialize(): { levels: { [key: string]: LevelState }; levelKey: string } {
        return {
            levels: this.levels,
            levelKey: this.levelKey,
        };
    }
    deserialize(serializedData: {
        levels: { [key: string]: LevelState };
        levelKey: string;
    }): void {
        this.levels = serializedData.levels;
        this.levelKey = this.levelKey;
    }
    public levels: { [key: string]: LevelState } = {};
    public levelKey: string = "";

    get currentLevel() {
        return this.levels[this.levelKey];
    }

    enterLevel(key: string) {
        if (this.levels[key]) {
            return;
        }
        this.levels[key] = {
            firedEvents: [],
            flags: {},
            monsters: {},
            dialogs: {},
            actionStates: {},
        };
        this.levelKey = key;
    }
    addActionState(type: string, data: any) {
        const actionState = this.currentLevel.actionStates[type];
        if (!actionState) {
            this.currentLevel.actionStates[type] = [];
        }
        this.currentLevel.actionStates[type].push(data);
    }

    getActionStates(type: string): any[] {
        return this.currentLevel.actionStates[type] || [];
    }

    updateLevelFlags(flags: { [key: string]: boolean }) {
        this.levels[this.levelKey].flags = {
            ...this.levels[this.levelKey].flags,
            ...flags,
        };
        this.hub.onChanged();
    }
    finishedBattle(outcome: BattleOutcome) {
        this.hub.events.battle.end.emit(outcome); // removes the enemy sprites
        if (outcome.heroWin) {
            this.currentLevel.monsters[outcome.deadEnemy] = { dead: true };
        }
        this.hub.onChanged();
    }
    finishedDialog(dialog: string) {
        this.currentLevel.dialogs[dialog] = { finished: true };
        this.hub.onChanged();
    }
}

export interface LevelState {
    flags: { [key: string]: boolean };
    monsters: { [key: string]: EnemyState };
    dialogs: { [key: string]: DialogState };
    firedEvents: string[];
    actionStates: { [type: string]: any[] };
}

export interface EnemyState {
    dead: boolean;
}

export interface DialogState {
    finished: boolean;
}
