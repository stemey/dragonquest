import { ConditionalDropItemRef } from "../types/ConditionalDropItemRef";
import { DropItemRef } from "../types/DropItemRef";
import { Level } from "../types/Level";
import { DragonQuestType } from "./DragonQuest";

export class LevelManager {
    private levels: { [key: string]: Level } = {};
    private currentLevelKey = "";

    constructor(private readonly hub: DragonQuestType) {}

    public get currentLevel() {
        return this.levels[this.currentLevelKey];
    }

    enterLevel(key: string, level: Level) {
        if (!this.levels[key]) {
            this.levels[key] = level;
        }
        this.currentLevelKey = key;
    }

    createVillains(monsterName: string) {
        const monsterNames = this.currentLevel.monsters[monsterName];
        return this.hub.gameManager.createVillains(monsterNames);
    }

    getLoot(lootName: any): (ConditionalDropItemRef | DropItemRef)[] {
        return this.currentLevel.loots[lootName];
    }
    getDialog(name: string) {
        return this.currentLevel.dialogs[name];
    }
}
