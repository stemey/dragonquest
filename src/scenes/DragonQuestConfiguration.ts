import { Action } from "../gameplay/worldaction/Action";

export class DrgonQuestConfiguration {
    actions: { [key: string]: Action<any> } = {};
}

export const dragonQuestConfiguration = new DrgonQuestConfiguration();
