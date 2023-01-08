import { Table, TextCell } from "../../gui/Table";
import * as Phaser from "phaser";
import { DragonQuest } from "../hub/DragonQuest";

export class Inventory extends Phaser.Scene {
    constructor() {
        super({ key: "InventoryScene" });
    }

    private entryWorld = "";

    create(data: { entryWorld: string }) {
        this.entryWorld = data.entryWorld;
        const graphics = this.add.graphics();
        this.createTable(graphics);

        this.events.on("wake", this.wake, this);

        this.input.keyboard.on("keydown", this.onKey, this);
    }

    createTable(graphics: Phaser.GameObjects.Graphics) {
        const table = new Table({
            x: 10,
            y: 10,
            rowHeight: 50,
            cellWidths: [100, 100],
            graphics: graphics,
            scene: this,
        });
        const row1 = table.addRow();
        row1.addCell(new TextCell("gold"));
        row1.addCell(
            new TextCell(() => String(DragonQuest.inventory.goldCount.get()))
        );
        for (let item of DragonQuest.inventory.items.values()) {
            const row2 = table.addRow();
            row2.addCell(new TextCell(item.name));
            row2.addCell(new TextCell("1"));
        }

        table.draw();
    }

    wake(sys: any, data: { entryWorld: string }) {
        const graphics = this.add.graphics();
        this.entryWorld = data.entryWorld;
        this.createTable(graphics);
    }

    onKey(event: KeyboardEvent) {
        if (event.code === "Escape") {
            this.scene.sleep();
            this.scene.wake(this.entryWorld);
        }
    }
}
