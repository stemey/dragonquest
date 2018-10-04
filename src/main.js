import Phaser from 'phaser'

import config from './config'
import UiScene from './scenes/UiScene'
import Battle from './scenes/Battle'
import Boot from './scenes/Boot'
import WorldScene from './scenes/World'

const gameConfig = Object.assign(config, {
  scene: [Boot, WorldScene, Battle, UiScene]
})

window.game = new Phaser.Game(gameConfig)
