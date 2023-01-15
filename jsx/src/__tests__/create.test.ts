import { GlobalState } from "../GlobalState";
import { useEffect } from "../useEffect";
import { useState } from "../useState";
import { create, globalState } from "../utils";
import { MockContainer, mockHelper, MockObjectFactory } from "./mocks";

const TagOne = () => new MockObjectFactory("TagOne");

const VirtualTag = (props: { listen?: (cb: (x: number) => void) => void }) => {
    const [length, setLength] = useState(5);

    useEffect(() => {
        if (props.listen) {
            props.listen((x) => {
                setLength(x);
            });
        }
    });

    return { tag: TagOne, props: { x: length } };
};

describe("create", () => {
    beforeEach(() => {
        globalState.current = new GlobalState();
    });
    it("props", () => {
        const m = create<undefined, MockContainer>(
            undefined,
            { tag: TagOne, props: { x: 0 } },
            mockHelper
        );
        expect(m).toBeDefined;
        expect(m.props.x).toBe(0);
    });
    it("children", () => {
        const m = create<undefined, MockContainer>(
            undefined,
            {
                tag: TagOne,
                props: { x: 0 },
                children: [{ tag: TagOne, props: { x: 3 } }],
            },
            mockHelper
        );
        expect(m).toBeDefined;
        expect(m.children).toHaveLength(1);
        expect(m.children[0].props.x).toBe(3);
    });
    it("virtual", () => {
        const m = create<undefined, MockContainer>(
            undefined,
            {
                tag: VirtualTag,
                props: {},
            },
            mockHelper
        );
        expect(m).toBeDefined;
        expect(m.props.x).toBe(5);
    });
    it("change state", () => {
        let myCb: (x: number) => void = () => {};
        const listen = (cb: (x: number) => void) => {
            myCb = cb;
        };
        const stateChange = jest.fn();
        globalState.current?.onStateChange(stateChange);
        const m = create<undefined, MockContainer>(
            undefined,
            {
                tag: VirtualTag,
                props: { listen },
            },
            mockHelper
        );
        myCb(10);
        const stateMap = globalState.current?.stateMap;
        expect(stateMap?.get("VirtualTag")?.states).toHaveLength(1);
        expect(stateMap?.get("VirtualTag")?.states[0].value).toBe(10);
        expect(stateMap?.size).toBe(1);
        expect(stateChange).toBeCalledTimes(1);
    });
});
