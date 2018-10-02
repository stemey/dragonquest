import Menu from './Menu'

export default class extends Menu {
  confirm () {
    this.scene.events.emit('Enemy', this.menuItemIndex)
  }
}
