import * as Phaser from "phaser";

import { config } from "./config";
import { UiScene } from "./scenes/UiScene";
import Battle from "./scenes/Battle";
import Boot from "./scenes/Boot";
import { Inventory } from "./scenes/Inventory";
import Road from "./scenes/Road";
import { WorldUiScene } from "./scenes/WorldUiScene";
import { dragonQuestConfiguration } from "./scenes/DragonQuestConfiguration";
import GatewayAction from "./gameplay/worldaction/GatewayAction";
import { LoadGame } from "./scenes/LoadGame";

const gameConfig = Object.assign(config, {
    scene: [Boot, Road, LoadGame, Battle, UiScene, Inventory, WorldUiScene],
});
dragonQuestConfiguration.actions["Gateway"] = GatewayAction;

const game = new Phaser.Game(gameConfig);
