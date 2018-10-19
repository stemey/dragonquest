import Action from './Action'

export default class extends Action {
  constructor (attack) {
    super()
    this.healing = attack.healing
    this.name = attack.name
  }

  execute (events, actor, target) {
    target.heal(this.healing)
    events.emit('Message', actor.type + 'heals ' + target.type)
  }

  get description () {
    return this.name + ' ' + this.healing
  }

}
