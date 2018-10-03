import Phaser from 'phaser'
import HeroesMenu from '../menu/HeroesMenu'
import ActionsMenu from '../menu/ActionsMenu'
import Message from '../ui/Message'

export default class extends Phaser.Scene {

  constructor () {
    super({ key: 'UIScene' })
  }

  create () {
    this.graphics = this.add.graphics()
    this.graphics.lineStyle(1, 0xffffff)
    this.graphics.fillStyle(0x031f4c, 1)
    this.graphics.strokeRect(2, 150, 90, 100)
    this.graphics.fillRect(2, 150, 90, 100)
    this.graphics.strokeRect(95, 150, 90, 100)
    this.graphics.fillRect(95, 150, 90, 100)
    this.graphics.strokeRect(188, 150, 130, 100)
    this.graphics.fillRect(188, 150, 130, 100)

    // basic container to hold all menus
    this.menus = this.add.container()

    this.battleScene = this.scene.get('BattleScene')
    var heroes = this.battleScene.heroes

    this.heroesMenu = new HeroesMenu(195, 153, this, heroes)
    this.actionsMenu = new ActionsMenu(100, 153, this)

    // the currently selected menu
    this.currentMenu = this.actionsMenu

    // add menus to the container
    this.menus.add(this.heroesMenu)
    this.menus.add(this.actionsMenu)

    this.input.keyboard.on('keydown', this.onKeyInput, this)

    this.battleScene.events.on('PlayerSelect', this.onPlayerSelect, this)
    this.battleScene.events.on('ActionFinished', this.onAttackLaunched, this)

    this.message = new Message(this, this.battleScene.events)
    this.add.existing(this.message)

    this.battleScene.nextTurn()
  }

  attack () {
    const actionIndex = this.actionsMenu.menuItemIndex
    this.heroesMenu.deselect()
    this.actionsMenu.deselect()
    this.currentMenu = null
    this.battleScene.receivePlayerSelection('attack', actionIndex)
  }

  onPlayerSelect (id, character) {
    this.heroesMenu.select(id)
    this.actionsMenu.initialize(character.attacks)
    this.actionsMenu.select(0)
    this.currentMenu = this.actionsMenu
  }

  onAttackLaunched () {
    this.heroesMenu.refresh()
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
