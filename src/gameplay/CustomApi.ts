import { DragonQuestType } from "./DragonQuest";

export class CustomApi {
    constructor(private dragonQuest: DragonQuestType) {
        console.log("this", dragonQuest);
    }

    setClass(name: "wizard" | "warrior") {
        this.dragonQuest.addHero(name);
    }

    addHero(name: string) {
        this.dragonQuest.addHero(name);
    }
}
