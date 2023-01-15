import { jsx } from "../jsx-runtime";
import { Text } from "../Text";
describe("test", () => {
    it("text", () => {
        const element = jsx(Text, { text: "hi", x: 0, y: 0 });
        expect(element).toBeDefined();
    });
});
//# sourceMappingURL=test.test.js.map