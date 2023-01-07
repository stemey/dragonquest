import * as Phaser from "phaser";
import { AbstractWorld } from "./AbstractWorld";
import { LoadEntry } from "./WorldEntryParameter";

export interface LoadGameParameters {
    scene: string;
    x: number;
    y: number;
}

export class LoadGame extends Phaser.Scene {
    constructor() {
        super({ key: "LoadGame" });
    }

    create(data: LoadGameParameters) {
        this.startWorld(data);
    }

    wake(sys: any, data: LoadGameParameters) {
        this.startWorld(data);
    }

    startWorld(data: LoadGameParameters) {
        const { x, y, scene } = data;

        this.scene.sleep();

        const existingScene = this.scene.get(scene);
        if (existingScene) {
            this.scene.wake(scene, {
                type: "load",
                x,
                y,
            } as LoadEntry);
        } else {
            const newLevel = new AbstractWorld({
                key: scene,
                physics: { matter: {}, arcade: {} },
            });
            this.scene.add(scene, newLevel);
            this.scene.launch(scene, {
                type: "load",
                x,
                y,
            } as LoadEntry);
        }
    }
}
