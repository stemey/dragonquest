import Phaser from 'phaser'
import WebFont from 'webfontloader'

export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'BootScene' })
  }

  preload () {
    this.fontsReady = false
    this.fontsLoaded = this.fontsLoaded.bind(this)
    this.add.text(100, 100, 'loading fonts...')

    // load resources
    this.load.spritesheet('player', 'assets/RPG_assets.png', { frameWidth: 16, frameHeight: 16 })
    this.load.image('dragonblue', 'assets/dragonblue.png')
    this.load.image('dragonorrange', 'assets/dragonorrange.png')

    WebFont.load({
      google: {
        families: ['Bangers']
      },
      active: this.fontsLoaded
    })
  }

  create () {
    this.scene.start('BattleScene')
  }

  fontsLoaded () {
    this.fontsReady = true
  }
}
