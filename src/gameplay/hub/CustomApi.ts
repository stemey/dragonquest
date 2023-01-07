import { DragonQuestType } from "./DragonQuest";

export class CustomApi {
    constructor(private dragonQuest: DragonQuestType) {
        console.log("this", dragonQuest);
    }

    setClass(name: "wizard" | "warrior") {
        this.dragonQuest.gameManager.addHero(name);
    }

    addHero(name: string) {
        this.dragonQuest.gameManager.addHero(name);
    }
}
