import Phaser from 'phaser'

const STATS = [{
  name: 'max HP',
  property: 'maxHp'
},
  {
    name: 'HP',
    property: 'hp'
  },
  {
    name: 'RK',
    property: 'armor'
  }
  ,
  {
    name: 'Name',
    property: 'type'
  }

]

export default class extends Phaser.GameObjects.Container {

  constructor (x, y, scene) {
    super(scene, x, y)
    this.values = {}

    STATS.forEach((stat, idx) => {
      this.addStat(stat.name, idx)
    })

  }

  addStat (name, idx) {
    this.add(new Phaser.GameObjects.Text(this.scene, 0, idx * 20, name + ' :'))
    this.values[name] = new Phaser.GameObjects.Text(this.scene, 80, idx * 20, '--')
    this.add(this.values[name])
  }

  characterSelected (selection) {
    if (selection.selectedCharacter) {
      STATS.forEach((stat) => {
        this.values[stat.name].text = selection.selectedCharacter[stat.property]
      })
    }
  }

}
