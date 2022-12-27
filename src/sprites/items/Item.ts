import { Scene } from "phaser";
import { DragonQuest } from "../../gameplay/DragonQuest";

export class Item {
    respawnTime = 60000;
    constructor(
        private scene: Scene,
        private sprite: Phaser.GameObjects.Sprite
    ) {}

    initialize() {
        this.sprite.visible = true;
        this.sprite.active = true;
    }

    pickedUp(player: Phaser.GameObjects.Sprite) {
        this.sprite.visible = false;
        this.sprite.active = false;
        this.scene.time.addEvent({
            delay: this.respawnTime,
            callback: this.initialize,
            callbackScope: this,
        });
    }
}
