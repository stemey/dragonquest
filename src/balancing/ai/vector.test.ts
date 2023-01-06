import { Space, Vector } from "./space";

describe("vector", () => {
    it("distance", () => {
        const v1 = new Vector([1, 1]);
        const v2 = new Vector([2, 1]);
        const dv = v2.subtract(v1);
        const d = dv.length();
        expect(d).toBe(1);
    });
});
