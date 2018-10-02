import Phaser from 'phaser'

import config from './config'
import UiScene from './scenes/UiScene'
import Battle from './scenes/Battle'
import Boot from './scenes/Boot'

const gameConfig = Object.assign(config, {
  scene: [Boot, Battle, UiScene]
})

window.game = new Phaser.Game(gameConfig)
