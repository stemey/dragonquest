import { GridProps } from "../GridProps";
import { createGeometry } from "../createGeometry";

describe("createGeometry", () => {
    it("createGeometry", () => {
        const props: GridProps = {
            areas: `
                    header header logo
                    left left right
                    footer footer footer 
            `,
            columns: "50 50 20",
            rows: "20 100 30",
            gap: { x: 0, y: 0 },
        };
        const geom = createGeometry(props);
        expect(Object.keys(geom)).toHaveLength(5);
        expect(geom["header"].height).toBe(20);
        expect(geom["header"].width).toBe(100);
        expect(geom["header"].x).toBe(0);
        expect(geom["header"].y).toBe(0);

        expect(geom["right"].height).toBe(100);
        expect(geom["right"].width).toBe(20);
        expect(geom["right"].x).toBe(100);
        expect(geom["right"].y).toBe(20);
    });
    it("createGeometry with percentage", () => {
        const props: GridProps = {
            areas: `
                    header header logo
                    left left right
                    footer footer footer 
            `,
            columns: "40% 40% 20%",
            rows: "20% 60% 10%",
            gap: { x: 0, y: 0 },
            width: 100,
            height: 100,
        };
        const geom = createGeometry(props);
        expect(Object.keys(geom)).toHaveLength(5);
        expect(geom["header"].height).toBe(20);
        expect(geom["header"].width).toBe(80);
        expect(geom["header"].x).toBe(0);
        expect(geom["header"].y).toBe(0);

        expect(geom["right"].height).toBe(60);
        expect(geom["right"].width).toBe(20);
        expect(geom["right"].x).toBe(80);
        expect(geom["right"].y).toBe(20);
    });
    it("createGeometry with percentage and gap", () => {
        const props: GridProps = {
            areas: `
                    header header header
                    left right right
            `,
            columns: "40% 10% 50%",
            rows: "20% 80%",
            gap: { x: 10, y: 10 },
            width: 120,
            height: 110,
        };
        const geom = createGeometry(props);
        expect(Object.keys(geom)).toHaveLength(3);
        expect(geom["header"].height).toBe(20);
        expect(geom["header"].width).toBe(120);
        expect(geom["header"].x).toBe(0);
        expect(geom["header"].y).toBe(0);

        expect(geom["right"].height).toBe(80);
        expect(geom["right"].width).toBe(70);
        expect(geom["right"].x).toBe(50);
        expect(geom["right"].y).toBe(30);
    });
});
