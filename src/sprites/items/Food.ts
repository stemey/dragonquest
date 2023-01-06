import { DragonQuest } from "../../gameplay/DragonQuest";
import { Item } from "./Item";

export class Food extends Item {
    private amount: number = 0;
    initialize() {
        this.amount = Math.round(Math.random() * 20) + 5;
        super.initialize();
    }

    pickedUp(player: Phaser.GameObjects.Sprite) {
        DragonQuest.foundFood(this.amount);
        super.initialize();
    }
}
