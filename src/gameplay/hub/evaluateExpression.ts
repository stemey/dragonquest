import { DragonQuest } from "./DragonQuest";
import { Expression } from "../types/Dialog";

export const evaluateExpression = (expression: Expression) => {
    const allItems = expression.requiredItems
        ? expression.requiredItems.every((i) =>
              DragonQuest.inventory.hasItem(i)
          )
        : true;
    const matchesLevelState = expression.levelState
        ? DragonQuest.matchesLevelState(expression.levelState)
        : true;
    const matchesPlayerState = expression.playerState
        ? DragonQuest.gameManager.getHero().className ===
          expression.playerState.className
        : true;

    return allItems && matchesLevelState && matchesPlayerState;
};
