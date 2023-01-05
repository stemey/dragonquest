export interface BattleOutcome {
    heroWin: boolean;
    deadEnemy: string;
}

export class GameState {
    public levels: { [key: string]: LevelState } = {};
    private levelKey: string = "";

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
        };
        this.levelKey = key;
    }

    updateLevelFlags(flags: { [key: string]: boolean }) {
        this.levels[this.levelKey].flags = {
            ...this.levels[this.levelKey].flags,
            ...flags,
        };
    }
    finishedBattle(outcome: BattleOutcome) {
        if (outcome.heroWin) {
            this.currentLevel.monsters[outcome.deadEnemy] = { dead: true };
        }
    }
}

export interface LevelState {
    flags: { [key: string]: boolean };
    monsters: { [key: string]: EnemyState };
    dialogs: { [key: string]: DialogState };
    firedEvents: string[];
}

export interface EnemyState {
    dead: boolean;
}

export interface DialogState {
    finished: boolean;
}
