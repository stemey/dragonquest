import { Character } from "../../gameplay/types/Character";
export interface Measurement<T> {
    vector: Vector;
    value: T;
}

export class Sector<T> {
    constructor(private dimensions: Dimension[]) {}
    public vectors: Measurement<T>[] = [];

    addVector(v: Vector, m: T) {
        if (!this.isInBounds(v)) {
            throw new Error("cannot be added here");
        }
        this.vectors.push({ value: m, vector: v });
    }
    isInBounds(vector: Vector) {
        return this.dimensions.reduce((value, d, index) => {
            value =
                value &&
                vector.get(index) >= d.min &&
                vector.get(index) < d.max;
            return value;
        }, true);
    }
    distance(v1: Vector, v2: Vector) {
        return v1.subtract(v2).length();
    }

    public getCloseMeasurements(
        vector: Vector,
        minDistance: number,
        except?: Vector
    ): Measurement<T>[] {
        return this.vectors.filter(
            (v) =>
                this.distance(v.vector, vector) <= minDistance &&
                !v.vector.equals(except)
        );
    }
}
export class SectorGroup<T> {
    constructor(
        protected dimensions: Dimension[],
        private sectorCount: number,
        depth = 1
    ) {
        this.sectors = this.generateSectors<T>(
            dimensions,
            sectorCount,
            depth - 1
        );
    }
    private sectors: (Sector<T> | SectorGroup<T>)[] = [];

    private generateSectors<T>(
        dimensions: Dimension[],
        sectorCount: number,
        depth: number
    ) {
        const allDimensions: Dimension[][] = [];
        dimensions.forEach((d) => {
            const newDimensions = this.split(d, sectorCount);
            allDimensions.push(newDimensions);
        });

        return allDimensions
            .reduce((sectors, ds) => {
                const newSectors: Dimension[][] = [];
                if (sectors.length === 0) {
                    ds.forEach((d) => {
                        newSectors.push([d]);
                    });
                } else {
                    sectors.forEach((s) => {
                        ds.forEach((d) => {
                            newSectors.push([...s, d]);
                        });
                    });
                }
                return newSectors;
            }, [] as Dimension[][])
            .map((ds) => {
                if (depth <= 0) {
                    return new Sector<T>(ds);
                } else {
                    return new SectorGroup<T>(ds, sectorCount, depth);
                }
            });
    }

    public getCloseMeasurements(
        vector: Vector,
        minDistance: number,
        except?: Vector
    ): Measurement<T>[] {
        const index = this.getSectorIndex(vector);
        return this.sectors[index].getCloseMeasurements(
            vector,
            minDistance,
            except
        );
    }

    split(d: Dimension, count: number) {
        const dimensions: Dimension[] = [];
        const step = (d.max - d.min) / count;
        for (let i = 0; i < count; i++) {
            dimensions.push({
                ...d,
                min: d.min + i * step,
                max: d.min + (i + 1) * step,
            });
        }
        return dimensions;
    }

    private getSectorIndex(vector: Vector) {
        return vector.values
            .map((v, idx) => {
                const d = this.dimensions[idx];
                const index = Math.trunc(
                    (v - d.min) / ((d.max - d.min) / this.sectorCount)
                );
                // idx 0 means
                const pow = vector.values.length - idx - 1;
                const fullIndex = index * Math.pow(this.sectorCount, pow);
                return fullIndex;
            })
            .reduce((acc, prev) => {
                acc += prev;
                return acc;
            }, 0);
    }

    addVector(vector: Vector, measurement: T) {
        const index = this.getSectorIndex(vector);

        this.sectors[index].addVector(vector, measurement);
    }

    public get vectors() {
        let vectors: Measurement<T>[] = [];
        this.sectors.forEach((s) => {
            vectors = vectors.concat(s.vectors);
        });
        return vectors;
    }
}
/*

0,0  - 0
0,1  - 1
1,0  - 2    
1,1  - 3    

index0*sectorCount+index1


0,0,0  - 0
0,0,1  - 1
0,1,0  - 2    
0,1,1   -3
1,0,0   -4
1,1  - 3    

index0*sectorCount^2+index1*sectorCount+index2



*/

export class Space<T> extends SectorGroup<T> {
    public constructor(
        dimensions: Dimension[],
        sectorCount: number,
        depth = 1
    ) {
        super(dimensions, sectorCount, depth);
    }

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
        this.addVector(vector, value);
        return vector;
    }

    getVector(character: Character) {
        return new Vector(this.dimensions.map((d) => d.getValue(character)));
    }

    createUnitVector(index: number, length: number) {
        const values = this.dimensions.reduce((values, d, idx) => {
            if (idx === index) {
                values.push(length);
            } else {
                values.push(0);
            }
            return values;
        }, [] as number[]);
        return new Vector(values);
    }

    isInBounds(vector: Vector) {
        return this.dimensions.reduce((value, d, index) => {
            value =
                value &&
                vector.get(index) >= d.min &&
                vector.get(index) < d.max;
            return value;
        }, true);
    }

    findNextVectors(vector: Vector) {
        const distance = 2;
        return this.dimensions.reduce((vectors, dimension, index) => {
            [-distance, distance].forEach((dir) => {
                const unitVector = this.createUnitVector(index, dir);
                const newVector = vector.add(unitVector);
                if (this.isInBounds(newVector)) {
                    if (
                        this.getCloseMeasurements(newVector, distance, vector)
                            .length === 0
                    ) {
                        vectors.push(newVector);
                    } else {
                        //console.log("already measured");
                    }
                }
            });

            return vectors;
        }, [] as Vector[]);
    }

    update(character: Character, vector: Vector) {
        this.dimensions.forEach((d, idx) =>
            d.setValue(character, vector.get(idx))
        );
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

    public equals(vector?: Vector) {
        return vector && !this.values.some((v1, idx) => v1 !== vector.get(idx));
    }

    changeLength(factor: number) {
        return new Vector(this.values.map((value) => value * factor));
    }

    length() {
        return Math.sqrt(
            this.values
                .map((v) => Math.pow(v, 2))
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

    asTupleString() {
        return "(" + this.values.map((d) => String(d)).join(", ") + ")";
    }
}
