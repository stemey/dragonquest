import * as Phaser from "phaser";
import { AbstractWorld } from "./AbstractWorld";
import { LoadEntry } from "./WorldEntryParameter";

export interface LoadGameParameters {
    scene: string;
    allLevels: string[];
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
        const { x, y, scene, allLevels } = data;
        allLevels.forEach((name) => this.scene.remove(name));

        const newLevel = new AbstractWorld({
            key: data.scene,
            physics: { matter: {}, arcade: {} },
        });
        this.scene.add(scene, newLevel);

        this.scene.sleep();

        this.scene.launch(data.scene, {
            type: "load",
            x,
            y,
        } as LoadEntry);
    }
}
