import Table, { TextCell } from '../gui/Table'
import Phaser from 'phaser'
import { DragonQuest } from '../gameplay/DragonQuest'

export default class extends Phaser.Scene {

  constructor () {
    super({ key: 'InventoryScene' })
  }

  create (data) {
    this.entryWorld = data.entryWorld
    this.graphics = this.add.graphics()
    this.createTable()

    this.events.on('wake', this.wake, this)

    this.input.keyboard.on('keydown', this.onKey, this)

  }

  createTable () {
    this.table = new Table({ x: 10, y: 10, rowHeight: 50, cellWidths: [100, 100], scene: this })
    const row1 = this.table.addRow()
    row1.addCell(new TextCell('gold'))
    row1.addCell(new TextCell(() => DragonQuest.goldCount.get()))
    for (let item of DragonQuest.items.values()) {
      const row2 = this.table.addRow()
      row2.addCell(new TextCell(item.description))
      row2.addCell(new TextCell(1))
    }

    this.table.draw()
  }

  wake (sys, data) {
    this.entryWorld = data.entryWorld
    this.createTable()
  }

  onKey (event) {
    if (event.code === 'Escape') {
      this.scene.sleep()
      this.scene.wake(this.entryWorld)
    }
  }

}
