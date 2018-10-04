import Phaser from 'phaser'
import WebFont from 'webfontloader'
import { characters } from '../gameplay/characters'

export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'BootScene' })
  }

  preload () {
    this.fontsReady = false
    this.fontsLoaded = this.fontsLoaded.bind(this)
    this.add.text(100, 100, 'loading fonts...')

    // map tiles
    this.load.image('tiles', 'assets/map/spritesheet.png');

    this.load.tilemapTiledJSON('map', 'assets/map/map.json');

    // load resources
    this.load.spritesheet('player', 'assets/RPG_assets.png', { frameWidth: 16, frameHeight: 16 })

    Object.values(characters.villains).forEach((villain) => {
      this.load.image(villain.image, 'assets/' + villain.image + '.png')
    })

    WebFont.load({
      google: {
        families: ['Bangers']
      },
      active: this.fontsLoaded
    })
  }

  create () {
    this.scene.start('WorldScene')
  }

  fontsLoaded () {
    this.fontsReady = true
  }
}
