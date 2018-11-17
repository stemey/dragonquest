import Phaser from 'phaser'

import config from './config'
import UiScene from './scenes/UiScene'
import Battle from './scenes/Battle'
import Boot from './scenes/Boot'
import WorldScene from './scenes/World'
import Castle from './scenes/Castle'
import Inventory from './scenes/Inventory'

const gameConfig = Object.assign(config, {
  scene: [Boot, WorldScene, Battle, UiScene, Castle, Inventory]
})

window.game = new Phaser.Game(gameConfig)
