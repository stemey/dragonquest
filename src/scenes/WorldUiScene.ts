import * as Phaser from "phaser";
import { DialogUi } from "../ui/DialogUi";

export class WorldUiScene extends Phaser.Scene {
    constructor() {
        super({ key: "WorldUiScene" });
    }

    private worldScene: string = "";
    private dialog?: DialogUi;

    create(data: { world: string }) {
        this.worldScene = data.world;
        const scene = this.scene.get(this.worldScene);

        if (scene) {
            this.dialog = new DialogUi(this);
            this.add.existing(this.dialog);
            this.input.keyboard.on("keydown", this.dialog.onKey, this.dialog);
        }
    }

    wake(sys: number, data: { world: string }) {}

    update() {
        this.dialog?.update();
    }
}
