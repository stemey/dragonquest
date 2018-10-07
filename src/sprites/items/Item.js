import { DragonQuest } from '../../gameplay/DragonQuest'

export default class {

  constructor (scene, sprite) {
    this.sprite = sprite
    this.scene = scene
    this.respawnTime = 60000
  }

  initialize () {
    this.sprite.visible = true
    this.sprite.active = true

  }

  pickedUp (player) {
    this.sprite.visible = false
    this.sprite.active = false
    this.scene.time.addEvent({ delay: this.respawnTime, callback: this.initialize, callbackScope: this })
  }

}
