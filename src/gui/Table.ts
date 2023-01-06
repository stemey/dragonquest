import { autorun } from "mobx";
import { Scene } from "phaser";

export class TextCell {
    constructor(private _text: string | (() => string)) {}

    get text() {
        if (typeof this._text === "function") {
            return this._text();
        }
        return this._text;
    }

    draw(scene: Scene, x: number, y: number, height: number, width: number) {
        const text = scene.add.text(x, y, this.text, {
            color: "#ffffff",
            align: "center",
            fontSize: "13",
            wordWrap: { width, useAdvancedWrap: true },
        });
        if (typeof this._text === "function") {
            autorun(() => {
                text.setText(this.text);
            });
        }
    }
}

export class Row {
    cells: TextCell[] = [];

    constructor(private config: { height: number }) {}

    addCell(cell: TextCell) {
        this.cells.push(cell);
    }

    get height() {
        return this.config.height;
    }
}

export interface TableConfig {
    scene: Scene;
    graphics: Phaser.GameObjects.Graphics;
    cellWidths: number[];
    rowHeight: number;
    x: number;
    y: number;
}

export class Table {
    rows: Row[] = [];
    tableWidth = 0;
    constructor(private config: TableConfig) {
        this.config = config;
        config.cellWidths.forEach(
            (cellWidth) => (this.tableWidth += cellWidth)
        );
    }

    addRow() {
        const row = new Row({ height: this.config.rowHeight });
        this.rows.push(row);
        return row;
    }

    draw() {
        this.config.graphics.lineStyle(1, 0xffffff);
        this.config.graphics.fillStyle(0x031f4c, 1);
        const { x, y } = this.config;
        const rows = this.rows;

        let tableHeight = 0;
        rows.forEach((row) => (tableHeight += row.height));

        this.config.graphics.fillRect(x, y, this.tableWidth, tableHeight);

        rows.forEach((row, idx) => {
            const rowX = x;
            const rowY = y + idx * row.height;
            this.drawRow(row, rowX, rowY, row.height, this.tableWidth);
        });
        // this.graphics.fillRect(scale * 2, scale * 150, scale * 150, scale * 100)
    }

    drawRow(
        row: Row,
        x: number,
        y: number,
        rowHeight: number,
        tableWidth: number
    ) {
        // this.scene.graphics.strokeRect(x, y, x + tableWidth, y + rowHeight)
        let currentX = x;
        row.cells.forEach((cell, idx) => {
            const currentCellWidth = this.config.cellWidths[idx];
            this.drawCell(cell, currentX, y, currentCellWidth, rowHeight);
            currentX = currentX + currentCellWidth;
        });
    }

    drawCell(
        cell: TextCell,
        x: number,
        y: number,
        cellWidth: number,
        cellHeight: number
    ) {
        this.config.graphics.strokeRect(x, y, cellWidth, cellHeight);
        cell.draw(this.config.scene, x, y, cellHeight, cellWidth);
    }
}
