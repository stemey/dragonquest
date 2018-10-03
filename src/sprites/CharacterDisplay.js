import Phaser from 'phaser'

export default class extends Phaser.GameObjects.Container {

  constructor (unit, scene, x, y) {
    super(scene, x, y)
    this.scene.events.on('ActionFinished', this.refresh, this)
    this.scene.events.on('UnitSelected', this.refreshSelection, this)
    this.unit = unit

    this.ellipse = new Phaser.GameObjects.Graphics(scene, { x: 0, y: 20 })
    this.ellipse.fillStyle(0x00000F, 0.5)
    this.ellipse.fillEllipse(0, 0, 50, 10, 32)
    this.ellipse.visible = false
    this.add(this.ellipse)

    this.selection = new Phaser.GameObjects.Graphics(scene, { x: 0, y: 20 })
    this.selection.lineStyle(1, 0x0000FF, 1)
    this.selection.strokeEllipse(0, 0, 50, 10)
    this.selection.visible = false
    this.add(this.selection)

    this.sprite = new Phaser.GameObjects.Sprite(scene, 0, 0, unit.image)
    this.add(this.sprite)
    this.label = new Phaser.GameObjects.Text(scene, -15, 30, this.text, { color: '#ffffff', align: 'left', fontSize: 10 })
    this.add(this.label)
  }

  get text () {
    return this.unit.hp + '/' + this.unit.maxHp
  }

  refreshSelection (ids) {
    if (ids.turnId >= 0) {
      this.ellipse.visible = ids.turnId === this.unit.id
    }

    this.selection.visible = ids.selectedId === this.unit.id

  }

  refresh () {
    this.label.setText(this.text)
  }

}
