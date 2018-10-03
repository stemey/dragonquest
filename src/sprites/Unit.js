import Phaser from 'phaser'
import Heal from '../gameplay/Heal'
import Attack from '../gameplay/Attack'

let unitId = 0

/**
 * properties:
 * hp
 * armor
 * armor
 * maxHp
 * attacks:
 *    - name
 *    - healing
 *    - strength
 *    - magical?
 *    - damage
 */
export default class {

  constructor (properties) {
    this.id = unitId++
    this.type = properties.name
    this.hp = properties.maxHp
    this.armor = properties.armor
    this.maxHp = properties.maxHp
    this.attacks = properties.attacks.map((action) => this.convertAction(action))
    this.image = properties.image
  }

  convertAction (action) {
    if (action.type && action.type === 'heal') {
      return new Heal(action)
    } else {
      return new Attack(action)
    }
  }

  actionPerformed (successful, action) {

  }

  isHurt (strength) {
    return strength > this.armor
  }

  heal (healing) {
    this.hp += healing
    if (this.hp > this.maxHp) {
      this.hp = this.maxHp
    }
  }

  takeDamage (damage) {
    this.hp -= damage
    if (this.hp < 0) {
      this.hp = 0
    }
  }

  get alive () {
    return this.hp > 0
  }
}
