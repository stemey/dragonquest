import Phaser from 'phaser'

export default class extends Phaser.GameObjects.Container {

  constructor (unit, scene, x, y) {
    super(scene, x, y)
    const scale = 2
    this.scene.events.on('ActionFinished', this.refresh, this)
    this.scene.events.on('UnitSelected', this.refreshSelection, this)
    this.unit = unit

    this.ellipse = new Phaser.GameObjects.Graphics(scene, { x: 0, y: scale * 20 })
    this.ellipse.fillStyle(0x00000F, 0.5)
    this.ellipse.fillEllipse(0, 0, scale * 50, scale * 10, scale * 32)
    this.ellipse.visible = false
    this.add(this.ellipse)

    this.selection = new Phaser.GameObjects.Graphics(scene, { x: 0, y: scale * 20 })
    this.selection.lineStyle(1, 0x0000FF, 1)
    this.selection.strokeEllipse(0, 0, scale * 50, scale * 10)
    this.selection.visible = false
    this.add(this.selection)

    this.sprite = new Phaser.GameObjects.Sprite(scene, 0, 0, unit.image)
    this.sprite.scaleX = 2
    this.sprite.scaleY = 2
    this.add(this.sprite)
    this.label = new Phaser.GameObjects.Text(scene, scale * -15, scale * 30, this.text, { color: '#ffffff', align: 'left', fontSize: scale * 10 })
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
    this.visible = this.unit.alive
  }

  destroy () {
    this.scene.events.removeListener('ActionFinished', this.refresh, this)
    this.scene.events.removeListener('UnitSelected', this.refreshSelection, this)
    super.destroy()
  }

}
