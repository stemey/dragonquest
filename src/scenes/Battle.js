import Phaser from 'phaser'
import PlayerCharacter from '../sprites/PlayerCharacter'
import Enemy from '../sprites/Enemy'
import { characters } from '../gameplay/characters'

export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'BattleScene' })
  }

  create () {
    // change the background to green
    this.cameras.main.setBackgroundColor('rgba(0, 200, 0, 0.5)')

    // player character - warrior
    var warrior = new PlayerCharacter(this, 250, 50, 'player', 1, characters.heroes.knight)
    this.add.existing(warrior)

    // player character - mage
    var mage = new PlayerCharacter(this, 250, 100, 'player', 4, characters.heroes.wizard)
    this.add.existing(mage)

    var dragonblue = new Enemy(this, 50, 50, 'dragonblue', null, characters.villains.dragon)
    this.add.existing(dragonblue)

    var dragonOrange = new Enemy(this, 50, 100, 'dragonorrange', null, characters.villains.dragon)
    this.add.existing(dragonOrange)

    // array with heroes
    this.heroes = [warrior, mage]
    // array with enemies
    this.enemies = [dragonblue, dragonOrange]
    // array with both parties, who will attack
    this.units = this.heroes.concat(this.enemies)

    // Run UI Scene at the same time
    this.scene.launch('UIScene')

    this.index = -1
  }

  nextTurn () {
    if (this.enemies.filter((enemy) => enemy.alive).length === 0) {
      this.events.emit('Message', 'Heroes win')
    } else if (this.heroes.filter((hero) => hero.alive).length === 0) {
      this.events.emit('Message', 'Villains win')
    } else {
      this.index++
      // if there are no more units, we start again from the first one
      if (this.index >= this.units.length) {
        this.index = 0
      }
      if (this.units[this.index]) {
        // if its player hero
        if (this.units[this.index] instanceof PlayerCharacter) {
          this.events.emit('PlayerSelect', this.index, this.units[this.index])
        } else { // else if its enemy unit
          // pick random hero
          var r = Math.floor(Math.random() * this.heroes.length)
          // call the enemy"s attack function
          const villain = this.units[this.index]
          if (villain.alive) {
            this.attack(villain, this.heroes[r], villain.attacks[0])
            // add timer for the next turn, so will have smooth gameplay
            this.time.addEvent({ delay: 3000, callback: this.nextTurn, callbackScope: this })
          } else {
            this.time.addEvent({ delay: 10, callback: this.nextTurn, callbackScope: this })
          }
        }
      }
    }
  }

  // when the player have selected the enemy to be attacked
  receivePlayerSelection (action, enemyIndex, actionIndex) {

    const attacker = this.units[this.index]
    const enemy = this.enemies[enemyIndex]
    const attack = attacker.attacks[actionIndex]
    this.attack(attacker, enemy, attack)

    // next turn in 3 seconds
    this.time.addEvent({ delay: 3000, callback: this.nextTurn, callbackScope: this })
  }

  attack (attacker, opponent, attack) {
    const strength = Math.random() * 20
    if (opponent.isHurt(attack.strength + strength)) {
      const strength = Math.random() * 8
      const totalDamage = Math.round(attack.damage + strength)
      opponent.takeDamage(totalDamage)
      attacker.actionPerformed(true, attack)
      if (!opponent.alive) {
        this.events.emit('Message', opponent.type + ' is unable to battle')

      } else {
        this.events.emit('Message', attacker.type + ' attacks ' + opponent.type + ' for ' + totalDamage + ' damage')

      }
    } else {
      this.events.emit('Message', attacker.type + '\'s attacks was futile')
    }
    this.events.emit('AttackLaunched')
  }
}
