import Phaser from 'phaser'
import ActionsMenu from '../menu/ActionsMenu'
import Message from '../ui/Message'

export default class extends Phaser.Scene {

  constructor () {
    super({ key: 'WorldUIScene' })
  }

  create () {
    const scale = 2
    this.graphics = this.add.graphics()
    this.graphics.lineStyle(1, 0xffffff)
    this.graphics.fillStyle(0x031f4c, 1)
    this.graphics.fillRect(0, 0, scale * 150, scale * 30)
    this.graphics.strokeRect(0, 0, scale * 150, scale * 30)

    // basic container to hold all menus
    this.menus = this.add.container()

    this.actionsMenu = new ActionsMenu(scale * 50, scale * 50, this)

    // add menus to the container
    this.menus.add(this.heroesMenu)
    this.menus.add(this.actionsMenu)

    this.input.keyboard.on('keydown', this.onKeyInput, this)

    this.battleScene.events.on('PlayerSelect', this.onPlayerSelect, this)
    this.battleScene.events.on('UnitSelected', this.heroesMenu.characterSelected, this.heroesMenu)

    this.message = new Message(this, this.battleScene.events)
    this.add.existing(this.message)

    // TODO should be in battleScene
    this.battleScene.nextTurn()
  }

  attack () {
    const actionIndex = this.actionsMenu.menuItemIndex
    this.actionsMenu.deselect()
    this.currentMenu = null
    this.battleScene.receivePlayerSelection('attack', actionIndex)
  }

  onPlayerSelect (id, character) {
    this.actionsMenu.initialize(character.attacks)
    this.actionsMenu.select(0)
    this.currentMenu = this.actionsMenu
  }

  onKeyInput (event) {
    if (this.currentMenu) {
      if (event.code === 'ArrowUp') {
        this.currentMenu.moveSelectionUp()
      } else if (event.code === 'ArrowDown') {
        this.currentMenu.moveSelectionDown()
      } else if (event.code === 'Space') {
        this.attack()
      }
    }
  }
}
