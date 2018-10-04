import Menu from './Menu'

export default class extends Menu {

  confirm () {
    this.scene.events.emit('ActionSelect', this.menuItemIndex)
  }

  initialize (attacks) {
    this.clear()
    for (let i = 0; i < attacks.length; i++) {
      const attack = attacks[i]
      this.addMenuItem(attack.description)
    }
  }
}
