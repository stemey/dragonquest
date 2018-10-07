import Phaser from 'phaser'

const STATS = [
  {
    name: 'Name',
    property: 'type'
  },
  {
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
    const scale = 2
    this.add(new Phaser.GameObjects.Text(this.scene, 0, scale * idx * 20, name + ' :', { color: '#ffffff', align: 'left', fontSize: scale * 10 }))
    this.values[name] = new Phaser.GameObjects.Text(this.scene, scale * 80, scale * idx * 20, '--', { color: '#ffffff', align: 'left', fontSize: scale * 10 })
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
