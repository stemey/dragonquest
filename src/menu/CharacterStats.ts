import * as Phaser from "phaser";
import { Unit } from "../sprites/Unit";

export interface UnitProperty {
    name: string;
    property: keyof Unit;
}

const STATS: UnitProperty[] = [
    {
        name: "Name",
        property: "name",
    },
    {
        name: "max HP",
        property: "maxHp",
    },
    {
        name: "HP",
        property: "hp",
    },
    {
        name: "RK",
        property: "armor",
    },
];

export class CharacterStats extends Phaser.GameObjects.Container {
    private values: { [key: string]: Phaser.GameObjects.Text } = {};
    constructor(x: number, y: number, scene: Phaser.Scene) {
        super(scene, x, y);

        STATS.forEach((stat, idx) => {
            this.addStat(stat.name, idx);
        });
    }

    addStat(name: string, idx: number) {
        const scale = 2;
        this.add(
            new Phaser.GameObjects.Text(
                this.scene,
                0,
                scale * idx * 20,
                name + " :",
                {
                    color: "#ffffff",
                    align: "left",
                    fontSize: String(scale * 10),
                }
            )
        );
        this.values[name] = new Phaser.GameObjects.Text(
            this.scene,
            scale * 80,
            scale * idx * 20,
            "--",
            { color: "#ffffff", align: "left", fontSize: String(scale * 10) }
        );
        this.add(this.values[name]);
    }

    characterSelected(selection: { selectedCharacter: Unit }) {
        if (selection.selectedCharacter) {
            STATS.forEach((stat) => {
                this.values[stat.name].text = String(
                    selection.selectedCharacter[stat.property]
                );
            });
        }
    }
}
