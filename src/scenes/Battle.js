import Phaser from 'phaser'
import { characters } from '../gameplay/characters'
import CharacterDisplay from '../sprites/CharacterDisplay'
import Unit from '../sprites/Unit'

export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'BattleScene' })

  }

  create () {
    // change the background to green
    this.cameras.main.setBackgroundColor('rgba(0, 200, 0, 0.5)')

    // player character - warrior
    var warrior = new Unit(characters.heroes.knight)
    this.add.existing(new CharacterDisplay(warrior, this, 250, 50))

    // player character - mage
    var mage = new Unit(characters.heroes.wizard)
    this.add.existing(new CharacterDisplay(mage, this, 250, 100))

    const monsters = Object.keys(characters.villains)

    this.enemies = []
    for (let i = 0; i < 2; i++) {
      const index = Math.floor(Math.random() * monsters.length)
      const monsterName = monsters[index]
      const monster = new Unit(characters.villains[monsterName])
      const monsterEnemy = new CharacterDisplay(monster, this, 50, 60 * i + 40)
      this.add.existing(monsterEnemy)
      this.enemies.push(monster)
    }

    // array with heroes
    this.heroes = [warrior, mage]
    // array with both parties, who will attack
    this.units = this.heroes.concat(this.enemies)

    // Run UI Scene at the same time
    this.scene.launch('UIScene')

    this.input.keyboard.on('keydown', this.onKeyInput, this)
    this.index = -1
    this.selectedIndex = 0
    this.playersTurn = false
  }

  nextTurn () {
    const oldUnit = this.units[this.index]
    if (oldUnit) {
      this.events.emit('UnitSelected', { turnId: -1 })
    }
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
      const currentUnit = this.units[this.index]
      this.events.emit('UnitSelected', { turnId: currentUnit.id })
      if (currentUnit) {
        // if its player hero
        if (this.heroes.indexOf(currentUnit) >= 0) {
          this.playersTurn = true
          this.selectedIndex = 0
          this.events.emit('UnitSelected', { selectedId: this.selectedIndex })
          this.events.emit('PlayerSelect', this.index, currentUnit)
        } else { // else if its enemy unit
          this.playersTurn = false
          this.events.emit('UnitSelected', { selectedId: -1 })
          // pick random hero
          this.events.emit('UnitSelected', { turnId: currentUnit.id })
          var r = Math.floor(Math.random() * this.heroes.length)
          // call the enemy"s attack function
          const villain = currentUnit
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
  receivePlayerSelection (action, actionIndex) {

    const attacker = this.units[this.index]
    const enemy = this.units[this.selectedIndex]
    const attack = attacker.attacks[actionIndex]
    this.attack(attacker, enemy, attack)

    // next turn in 3 seconds
    this.time.addEvent({ delay: 3000, callback: this.nextTurn, callbackScope: this })
  }

  attack (attacker, opponent, attack) {
    attack.execute(this.events, attacker, opponent)
    this.events.emit('ActionFinished')
  }

  onKeyInput (event) {
    if (this.playersTurn) {
      if (event.code === 'ArrowLeft') {
        this.selectedIndex--
        if (this.selectedIndex < 0) {
          this.selectedIndex = this.units.length - 1
        }
        this.events.emit('UnitSelected', { selectedId: this.units[this.selectedIndex].id })
      } else if (event.code === 'ArrowRight') {
        this.selectedIndex++
        if (this.selectedIndex >= this.units.length) {
          this.selectedIndex = 0
        }
        this.events.emit('UnitSelected', { selectedId: this.units[this.selectedIndex].id })
      }
    }
  }

}
