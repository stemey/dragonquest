import { Level } from "../types/Level";
import { CustomApi } from "./CustomApi";
import { GameState, LevelState } from "./GameState";
import { Inventory } from "../inventory/Inventory";
import { Game } from "phaser";
import { PlayerProgress } from "./PlayerProgress";
import { matchesLevelState } from "./matchesLevelState";
import { StorePointManager } from "./StorePointManager";
import { GameManager } from "./GameManager";
import { LevelManager } from "./LevelManager";

export class DragonQuestType {
    matchesLevelState(levelState: Partial<LevelState>) {
        return matchesLevelState(this.gameState.currentLevel, levelState);
    }

    public inventory = new Inventory(this);
    public storePointManager = new StorePointManager(this);
    public gameManager = new GameManager(this);
    public levelManager = new LevelManager(this);
    public api = new CustomApi(this);
    public gameState = new GameState(this);
    public playerState: PlayerProgress = new PlayerProgress();
    private game?: Game;

    init(game: Game) {
        this.game = game;
    }

    updateLevelFlags(flags: { [key: string]: boolean }) {
        this.gameState.updateLevelFlags(flags);
        this.onChanged();
    }

    getLastSafePlayerPosition() {
        return this.playerState.getLastSafePlayerPosition();
    }

    public updatePlayerPosition(scene: string, x: number, y: number) {
        this.playerState?.update(scene, x, y);
    }

    setLevel(key: string, level: Level) {
        this.levelManager.enterLevel(key, level);
        this.gameState.enterLevel(key);
    }

    emitGameEvent(event: string, data: any) {
        this.game?.events.emit(event, data);
    }

    onChanged() {
        Object.keys(this.levelManager.currentLevel.events).forEach((name) => {
            const event = this.levelManager.currentLevel.events[name];
            if (
                this.gameState.currentLevel.firedEvents.indexOf(name) < 0 &&
                matchesLevelState(
                    this.gameState.currentLevel,
                    event.trigger.levelState
                )
            ) {
                this.gameState.currentLevel.firedEvents.push(name);
                this.game?.events.emit("DialogStart", event.dialog);
            }
        });
    }
}

export const DragonQuest = new DragonQuestType();
(window as any).DragonQuest = DragonQuest;
