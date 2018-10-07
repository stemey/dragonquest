import { DragonQuest } from '../../gameplay/DragonQuest'
import Item from './Item'

export default class extends Item {

  constructor (scene, sprite) {
    super(scene, sprite)
    this.respawnTime = 60000
  }

  initialize () {
    this.amount = Math.round(Math.random() * 20) + 5
    super.initialize()

  }

  pickedUp (player) {
    DragonQuest.foundFood(this.amount)
    super.initialize()
  }

}
