import { autorun } from 'mobx'

export class TextCell {

  constructor (text) {
    this._text = text

  }

  get text () {
    if (typeof this._text === 'function') {
      return this._text()
    }
    return this._text
  }

  draw (scene, x, y, height, width) {
    this.go = scene.add.text(x, y, this.text, { color: '#ffffff', align: 'center', fontSize: 13, wordWrap: { width, useAdvancedWrap: true } })
    if (typeof this._text === 'function') {
      autorun(() => {
        this.go.setText(this.text)

      })
    }
  }
}

export class Row {
  constructor (config) {
    this.height = config.height
    this.cells = []
  }

  addCell (cell) {
    this.cells.push(cell)
  }

}

export default class {

  constructor (config) {
    this.rows = []
    this.config = config
    this.tableWidth = 0
    config.cellWidths.forEach((cellWidth) => this.tableWidth += cellWidth)
    this.scene = config.scene
  }

  addRow () {
    const row = new Row({ height: this.config.rowHeight })
    this.rows.push(row)
    return row
  }

  draw () {
    this.scene.graphics.lineStyle(1, 0xffffff)
    this.scene.graphics.fillStyle(0x031f4c, 1)
    const { x, y } = this.config
    const rows = this.rows

    let tableHeight = 0
    rows.forEach((row) => tableHeight += row.height)

    this.scene.graphics.fillRect(x, y, this.tableWidth, tableHeight)

    rows.forEach((row, idx) => {
      const rowX = x
      const rowY = y + idx * row.height
      this.drawRow(row, rowX, rowY, row.height, this.tableWidth)
    })
    // this.graphics.fillRect(scale * 2, scale * 150, scale * 150, scale * 100)

  }

  drawRow (row, x, y, rowHeight, tableWidth) {
    // this.scene.graphics.strokeRect(x, y, x + tableWidth, y + rowHeight)
    let currentX = x
    row.cells.forEach((cell, idx) => {
      const currentCellWidth = this.config.cellWidths[idx]
      this.drawCell(cell, currentX, y, currentCellWidth, rowHeight)
      currentX = currentX + currentCellWidth
    })

  }

  drawCell (cell, x, y, cellWidth, cellHeight) {
    this.scene.graphics.strokeRect(x, y, cellWidth, cellHeight)
    cell.draw(this.scene, x, y, cellHeight, cellWidth)

  }

}
