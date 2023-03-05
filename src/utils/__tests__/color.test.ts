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
});
