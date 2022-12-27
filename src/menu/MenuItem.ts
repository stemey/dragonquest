import { Scene } from "phaser";

export default class extends Phaser.GameObjects.Text {
    constructor(x: number, y: number, text: string, scene: Scene) {
        super(scene, x, y, text, {
            color: "#ffffff",
            align: "left",
            fontSize: "15",
        });
    }

    select() {
        this.setColor("#f8ff38");
    }

    deselect() {
        this.setColor("#ffffff");
    }
}
