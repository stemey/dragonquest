import Phaser from 'phaser'

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
export default class extends Phaser.GameObjects.Sprite {

  constructor (scene, x, y, texture, frame, properties) {
    super(scene, x, y, texture, frame)
    this.type = properties.name
    this.hp = properties.maxHp
    this.armor = properties.armor
    this.maxHp = properties.maxHp
    this.attacks = properties.attacks
  }

  actionPerformed(successful, action) {

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
