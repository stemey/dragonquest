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
    this.load.image('terrain', 'assets/map/terrain.png')
    this.load.image('VX Architecture Tileset', 'assets/map/VX Architecture Tileset.png')
    this.load.image('VX BuildingsTileset', 'assets/map/VX BuildingsTileset.png')
    this.load.image('VX DungeonTileset', 'assets/map/VX DungeonTileset.png')
    this.load.image('VX Interior Tileset', 'assets/map/VX Interior Tileset.png')
    this.load.image('VX Plants Tileset', 'assets/map/VX Plants Tileset.png')
    this.load.image('VX Scenery Tileset', 'assets/map/VX Scenery Tileset.png')
    this.load.image('VX Shop Tileset', 'assets/map/VX Shop Tileset.png')
    this.load.image('VX Winter Tileset', 'assets/map/VX Winter Tileset.png')

    this.load.tilemapTiledJSON('map', 'assets/map/smallmap.json')

    // load resources
    this.load.spritesheet('player', 'assets/RPG_assets.png', { frameWidth: 16, frameHeight: 16 })

    this.load.spritesheet('scenery', 'assets/map/VX Scenery Tileset.png', { frameWidth: 32, frameHeight: 32 })

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
