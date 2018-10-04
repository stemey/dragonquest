import Action from './Action'

export default class extends Action {
  constructor (attack) {
    super()
    this.properties = attack
    this.name = attack.name
  }

  execute (events, actor, target) {
    const strength = Math.random() * 20
    if (target.isHurt(this.properties.strength + strength)) {
      const strength = Math.random() * 8
      const totalDamage = Math.round(this.properties.damage + strength)
      target.takeDamage(totalDamage)
      actor.actionPerformed(true, this.properties)
      if (!target.alive) {
        events.emit('Message', target.type + ' is unable to battle')

      } else {
        events.emit('Message', actor.type + ' attacks ' + target.type + ' for ' + totalDamage + ' damage')

      }
    } else {
      events.emit('Message', actor.type + '\'s attacks was futile')
    }

  }

  get description () {
    return this.name + ' ' + this.properties.strength + '/' + this.properties.damage
  }
}
