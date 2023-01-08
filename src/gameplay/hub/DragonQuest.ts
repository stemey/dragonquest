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
import { DragonEvents } from "../DragonEvents";

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
    public events = DragonEvents;

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

    emitGameEvent(event: string, data: any, ctx?: any) {
        this.game?.events.emit(event, data, ctx);
    }

    onGameEvent(event: string, cb: (data: any) => void, ctx?: any) {
        this.game?.events.on(event, cb, ctx);
    }

    emitEvent(type: "level" | "game", event: string, data: any) {
        switch (type) {
            case "game":
                this.emitGameEvent(event, data);
                break;
            case "level":
                this.emitLevelEvent(event, data);
                break;
        }
    }

    onEvent(
        type: "level" | "game",
        event: string,
        cb: (data: any) => void,
        ctx?: any
    ) {
        switch (type) {
            case "game":
                this.onGameEvent(event, cb, ctx);
                break;
            case "level":
                this.onLevelEvent(event, cb, ctx);
                break;
        }
    }

    emitLevelEvent(event: string, data: any) {
        const level = this.levelManager.currentLevelKey;
        this.game?.scene.getScene(level).events.emit(event, data);
    }

    onLevelEvent(event: string, cb: (data: any) => void, ctx?: any) {
        const level = this.levelManager.currentLevelKey;
        this.game?.scene.getScene(level).events.on(event, cb);
    }

    onChanged() {
        Object.keys(this.levelManager.currentLevel.events).forEach((name) => {
            const event = this.levelManager.currentLevel.events[name];
            if (
                // TODO migrate to gamestate
                this.gameState.currentLevel.firedEvents.indexOf(name) < 0 &&
                this.matchesLevelState(event.trigger.levelState)
            ) {
                // TODO migrate to gamestate
                this.gameState.currentLevel.firedEvents.push(name);
                this.events.dialog.start.emit(event.dialog);
            }
        });
    }
}

export const DragonQuest = { instance: new DragonQuestType() };
(window as any).DragonQuest = DragonQuest;
