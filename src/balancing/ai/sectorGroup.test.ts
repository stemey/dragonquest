import { Dimension, SectorGroup, Space, Vector } from "./space";

describe("sector group", () => {
    describe("addVector", () => {
        it("2 dimensions with 2 sectors", () => {
            const d1: Dimension = {
                min: 0,
                max: 9,
                getValue: () => 0,
                setValue: () => 0,
            };
            const d2: Dimension = {
                min: 0,
                max: 9,
                getValue: () => 0,
                setValue: () => 0,
            };
            const group = new SectorGroup([d1, d2], 2, 1);
            group.addVector(new Vector([1, 1]), 1);
            group.addVector(new Vector([5, 1]), 1);
            group.addVector(new Vector([1, 5]), 1);
            group.addVector(new Vector([5, 5]), 1);
        });
        it("3 dimensions with 3 sectors", () => {
            const d1: Dimension = {
                min: 0,
                max: 9,
                getValue: () => 0,
                setValue: () => 0,
            };
            const d2: Dimension = {
                min: 0,
                max: 9,
                getValue: () => 0,
                setValue: () => 0,
            };
            const d3: Dimension = {
                min: 0,
                max: 15,
                getValue: () => 0,
                setValue: () => 0,
            };
            const group = new SectorGroup([d1, d2, d3], 3, 1);
            group.addVector(new Vector([1, 1, 1]), 1);
            group.addVector(new Vector([5, 1, 1]), 1);
            group.addVector(new Vector([1, 5, 5]), 1);
            group.addVector(new Vector([5, 5, 13]), 1);
        });
        it("4 dimensions with 2 sectors", () => {
            const d1: Dimension = {
                min: 5,
                max: 25,
                getValue: () => 0,
                setValue: () => 0,
            };
            const d2: Dimension = {
                min: 5,
                max: 25,
                getValue: () => 0,
                setValue: () => 0,
            };
            const d3: Dimension = {
                min: 5,
                max: 25,
                getValue: () => 0,
                setValue: () => 0,
            };
            const d4: Dimension = {
                min: 5,
                max: 25,
                getValue: () => 0,
                setValue: () => 0,
            };
            const group = new SectorGroup([d1, d2, d3, d4], 2, 1);
            group.addVector(new Vector([5, 5, 5, 5]), 1);
            group.addVector(new Vector([5, 20, 5, 5]), 1);
            group.addVector(new Vector([5, 5, 20, 5]), 1);
            group.addVector(new Vector([5, 20, 20, 5]), 1);
            group.addVector(new Vector([20, 20, 20, 5]), 1);
            group.addVector(new Vector([5, 5, 20, 24.9]), 1);
        });
    });
    describe("getCloseMeasurements", () => {
        it("getCloseMeasurements", () => {
            const d1: Dimension = {
                min: 0,
                max: 9,
                getValue: () => 0,
                setValue: () => 0,
            };
            const d2: Dimension = {
                min: 0,
                max: 9,
                getValue: () => 0,
                setValue: () => 0,
            };
            const group = new SectorGroup([d1, d2], 3, 1);
            group.addVector(new Vector([1, 1]), 1);
            const mx = group.getCloseMeasurements(new Vector([2, 1]), 1);
            expect(mx).toHaveLength(1);
        });
    });
    describe("findNextVectors", () => {
        it("simple", () => {
            const d1: Dimension = {
                min: 0,
                max: 9,
                getValue: () => 0,
                setValue: () => 0,
            };
            const d2: Dimension = {
                min: 0,
                max: 9,
                getValue: () => 0,
                setValue: () => 0,
            };
            const group = new Space([d1, d2], 3, 1);
            const next = group.findNextVectors(new Vector([2, 2]));
            expect(next).toHaveLength(4);
        });
        it("already measured", () => {
            const d1: Dimension = {
                min: 0,
                max: 9,
                getValue: () => 0,
                setValue: () => 0,
            };
            const d2: Dimension = {
                min: 0,
                max: 9,
                getValue: () => 0,
                setValue: () => 0,
            };
            const group = new Space([d1, d2], 3, 1);
            group.addVector(new Vector([4, 2]), 1);
            group.addVector(new Vector([0, 2]), 1);
            const next = group.findNextVectors(new Vector([2, 2]));
            expect(next).toHaveLength(2);
        });
    });
});
