import Phaser from 'phaser'

import config from './config'
import UiScene from './scenes/UiScene'
import Battle from './scenes/Battle'
import Boot from './scenes/Boot'
import WorldScene from './scenes/World'
import Castle from './scenes/Castle'

const gameConfig = Object.assign(config, {
  scene: [Boot, WorldScene, Battle, UiScene, Castle]
})

window.game = new Phaser.Game(gameConfig)
