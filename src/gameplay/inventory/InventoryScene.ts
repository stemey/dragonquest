import { Table, TextCell } from "../../gui/Table";
import * as Phaser from "phaser";
import { DragonQuest } from "../hub/DragonQuest";
import { ReversibleData, SceneTransitions } from "../SceneTransitions";
import { SceneWithReversibleTransitions } from "../../scenes/SceneWithReversibleTransitions";

export class Inventory
    extends Phaser.Scene
    implements SceneWithReversibleTransitions
{
    private reverse?: (data: {}) => void;
    constructor() {
        super({ key: "InventoryScene" });
    }

    create(data: ReversibleData) {
        this.reverse = data.reverse;
        SceneTransitions.inventory.onWake(this, this.onWake, this);

        const graphics = this.add.graphics();
        this.createTable(graphics);

        this.input.keyboard?.on("keydown", this.onKey, this);
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
            new TextCell(() =>
                String(DragonQuest.instance.inventory.goldCount.get())
            )
        );
        for (let item of DragonQuest.instance.inventory.items.values()) {
            const row2 = table.addRow();
            row2.addCell(new TextCell(item.name));
            row2.addCell(new TextCell("1"));
        }

        table.draw();
    }

    onWake(data: ReversibleData) {
        this.reverse = data.reverse;
        const graphics = this.add.graphics();
        this.createTable(graphics);
    }

    onKey(event: KeyboardEvent) {
        if (this.reverse && event.code === "Escape") {
            this.reverse(this.scene);
        }
    }
}
