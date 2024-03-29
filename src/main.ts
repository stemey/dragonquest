import * as Phaser from "phaser";

import { config } from "./config";
import { BattleScene } from "./gameplay/battle/BattleScene";
import Boot from "./boot/Boot";
import { Inventory } from "./gameplay/inventory/InventoryScene";
import Road from "./scenes/Road";
import { WorldUiScene } from "./gameplay/dialog/WorldUiScene";
import { dragonQuestConfiguration } from "./boot/DragonQuestConfiguration";
import GatewayAction from "./gameplay/worldaction/GatewayAction";
import { LoadGame } from "./scenes/LoadGame";
import { UiScene } from "./gameplay/battle/UiScene";

const gameConfig = Object.assign(config, {
    scene: [
        Boot,
        Road,
        LoadGame,
        BattleScene,
        UiScene,
        Inventory,
        WorldUiScene,
    ],
});
dragonQuestConfiguration.actions["Gateway"] = GatewayAction;

const game = new Phaser.Game(gameConfig);
