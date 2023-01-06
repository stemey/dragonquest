import { Action } from "../gameplay/worldaction/Action";

export class DrgonQuestConfiguration {
    actions: { [key: string]: Action } = {};
}

export const dragonQuestConfiguration = new DrgonQuestConfiguration();
