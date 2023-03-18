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
            gap: { x: 10, y: 30 },
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
});
