import { getComplimentary } from "../color";

describe("color", () => {
    it("getComplimentary red", () => {
        const color = getComplimentary(0xff0000);
        expect(color).toBe(0x00ffff);
    });
    it("getComplimentary green", () => {
        const color = getComplimentary(0x00ff00);
        expect(color).toBe(0xff00ff);
    });
    it("getComplimentary green", () => {
        const color1 = getComplimentary(0xffff00);
        const color2 = getComplimentary(0xf0ff00);
        expect(Math.abs(color1-color2)).toBeGreaterThan(0)
    });
});
