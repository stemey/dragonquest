import * as Phaser from "phaser";

import { config } from "./config";
import { UiScene } from "./scenes/UiScene";
import Battle from "./scenes/Battle";
import Boot from "./scenes/Boot";
import WorldScene from "./scenes/World";
import Castle from "./scenes/Castle";
import { Inventory } from "./scenes/Inventory";
import Road from "./scenes/Road";
import { WorldUiScene } from "./scenes/WorldUiScene";

const gameConfig = Object.assign(config, {
    scene: [Boot, Road, WorldScene, Battle, UiScene, Castle, Inventory,WorldUiScene],
});
const game = new Phaser.Game(gameConfig);
