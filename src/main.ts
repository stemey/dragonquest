import * as Phaser from "phaser";

import { config } from "./config";
import Battle from "./gameplay/battle/Battle";
import Boot from "./scenes/Boot";
import { Inventory } from "./gameplay/inventory/InventoryScene";
import Road from "./scenes/Road";
import { WorldUiScene } from "./gameplay/dialog/WorldUiScene";
import { dragonQuestConfiguration } from "./scenes/DragonQuestConfiguration";
import GatewayAction from "./gameplay/worldaction/GatewayAction";
import { LoadGame } from "./scenes/LoadGame";
import { UiScene } from "./gameplay/battle/UiScene";

const gameConfig = Object.assign(config, {
    scene: [Boot, Road, LoadGame, Battle, UiScene, Inventory, WorldUiScene],
});
dragonQuestConfiguration.actions["Gateway"] = GatewayAction;

const game = new Phaser.Game(gameConfig);
