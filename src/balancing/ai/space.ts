import { Character } from "../../gameplay/types/Character";
import { Weapon } from "../../gameplay/types/Weapon";
import { chooseAttacksRandom } from "../chooseAttacksRandom";
import { fight } from "../fight";
export interface Measurement<T> {
    vector: Vector;
    value: T;
}
export class Space<T> {
    public constructor(private dimensions: Dimension[]) {}

    distance(v1: Vector, v2: Vector) {
        return v1.subtract(v2).length();
    }

    changeLength(v: Vector) {
        const distance = this.distance(v, v);
        return v.changeLength(1 / distance);
    }
    addMeasurement(character: Character, value: T) {
        const vector = new Vector(
            this.dimensions.map((d) => d.getValue(character))
        );
        this.vectors.push({ vector, value });
        return vector;
    }

    findNextVectors(vector: Vector) {
        return this.dimensions.reduce((vectors, dimension, index) => {
            const values = this.dimensions.reduce((values, d, idx) => {
                if (idx === index) {
                    values.push(1);
                } else {
                    values.push(0);
                }
                return values;
            }, [] as number[]);
            if (
                vector.get(index) >= dimension.min &&
                vector.get(index) <= dimension.max
            ) {
                const newVector = new Vector(values);
                const closeMeasurements = this.vectors.filter(
                    (v) =>
                        this.distance(v.vector, newVector) <= 1 &&
                        v.vector !== vector
                );
                if (closeMeasurements.length === 0) {
                    vectors.push(vector.add(newVector));
                }
            }

            return vectors;
        }, [] as Vector[]);
    }

    update(character: Character, vector: Vector) {
        this.dimensions.forEach((d, idx) =>
            d.setValue(character, vector.get(idx))
        );
    }

    private vectors: Measurement<T>[] = [];
}

export class Tester {
    private space = new Space([
        {
            min: 5,
            max: 20,
            getValue: (unit) => unit.armor,
            setValue: (unit, value: number) => (unit.armor = value),
        },
        {
            min: 5,
            max: 20,
            getValue: (unit) => unit.maxHp,
            setValue: (unit, value: number) => (unit.maxHp = value),
        },
        {
            min: 5,
            max: 20,
            getValue: (unit) => (unit.attacks[0] as Weapon).damage,
            setValue: (unit, value: number) =>
                ((unit.attacks[0] as Weapon).damage = value),
        },
        {
            min: 5,
            max: 20,
            getValue: (unit) => (unit.attacks[0] as Weapon).strength,
            setValue: (unit, value: number) =>
                ((unit.attacks[0] as Weapon).strength = value),
        },
    ]);

    start(initialEnemy: Character, hero: Character) {
        // try all "sensible" directions. choose x% of distance to end
        // check the directions that improve the reward
        // continue with the best results.
        // find the max

        this.test(initialEnemy,hero)
    }

    test(enemy: Character, hero: Character) {
        const result = fight([enemy], [hero], chooseAttacksRandom);
        let vector = this.space.addMeasurement(enemy, result);
        console.log("result",result.rounds )
        if (result.rounds < 3 && result.outcome !== "hero") {
            return enemy;
        }
        const vectors = this.space.findNextVectors(vector);
        vectors.forEach((v) => {
            this.space.update(enemy, v);
            return this.test(enemy, hero);
        });
        return undefined;
    }
}

export interface Dimension {
    min: number;
    max: number;
    getValue: (character: Character) => number;
    setValue: (character: Character, value: number) => void;
}

export class Vector {
    constructor(public values: number[]) {}

    get(index: number) {
        return this.values[index];
    }

    changeLength(factor: number) {
        return new Vector(this.values.map((value) => value * factor));
    }

    length() {
        return Math.sqrt(
            this.values
                .map((v) => v ^ 2)
                .reduce((acc, v) => {
                    acc += v;
                    return acc;
                }, 0)
        );
    }

    create(index: number, delta: number) {
        const clone = [...this.values];
        clone[index] = this.values[index] + delta;
        return new Vector(clone);
    }
    add(v: Vector) {
        return new Vector(this.values.map((value, idx) => value + v.get(idx)));
    }
    subtract(v: Vector) {
        return new Vector(this.values.map((value, idx) => value - v.get(idx)));
    }

    negate(v: Vector) {
        return new Vector(this.values.map((value) => -value));
    }
}
