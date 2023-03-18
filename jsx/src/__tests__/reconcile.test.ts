import { Element } from "../Element";
import { GlobalState } from "../GlobalState";
import { Tag } from "../jsx-runtime";
import { useEffect } from "../useEffect";
import { useState } from "../useState";
import { create, globalState, reconcile } from "../utils";
import { MockContainer, mockHelper, MockObjectFactory } from "./mocks";

const TagOne = () => new MockObjectFactory("TagOne");
const TagTwo = () => new MockObjectFactory("TagTwo");

let dispose = jest.fn();

const VirtualTag: Tag<any> = (props: {
    listen?: (cb: (x: number) => void) => void;
    y?: number;
    children?: Element<any>[];
}) => {
    const [length, setLength] = useState(5);
    useEffect(() => {
        if (props.listen) {
            props.listen((x) => {
                setLength(x);
            });
        }
        return dispose;
    });

    return { tag: TagOne, props: { x: length, y:props.y }, children: props.children };
};

describe("reconcile", () => {
    beforeEach(() => {
        globalState.current = new GlobalState();
        dispose.mockReset();
    });
    it("props", () => {
        const initial = { tag: TagOne, props: { x: 0 } };
        const m = create<undefined, MockContainer>(
            undefined,
            initial,
            mockHelper
        );
        if (!m) {
            fail("error");
        }
        reconcile<undefined, MockContainer>(
            undefined,
            initial,
            { tag: TagOne, props: { x: 1 } },
            m,
            mockHelper
        );
        expect(m.props.x).toBe(1);
        expect(m.tagName).toBe("TagOne");
    });
    it("add children", () => {
        const initial = {
            tag: TagOne,
            props: { x: 0 },
            children: [{ tag: TagOne, props: { x: 3 } }],
        };
        const m = create<undefined, MockContainer>(
            undefined,
            initial,
            mockHelper
        );
        if (!m) {
            fail("error");
        }
        reconcile<undefined, MockContainer>(
            undefined,
            initial,
            {
                tag: TagOne,
                props: {
                    x: 1,
                },
                children: [
                    { tag: TagOne, props: { x: 9 } },
                    { tag: TagOne, props: { x: 1 } },
                ],
            },
            m,
            mockHelper
        );
        expect(m.props.x).toBe(1);
        expect(m).toBeDefined;
        expect(m.children).toHaveLength(2);
        expect(m.children[0].props.x).toBe(9);
        expect(m.children[1].props.x).toBe(1);
    });
    it("change children", () => {
        const initial = {
            tag: TagOne,
            props: { x: 0 },
            children: [{ tag: TagTwo, props: { x: 3 }, children: [] }],
        };
        const m = create<undefined, MockContainer>(
            undefined,
            initial,
            mockHelper
        );
        if (!m) {
            fail("error");
        }
        reconcile<undefined, MockContainer>(
            undefined,
            initial,
            {
                tag: TagOne,
                props: {
                    x: 1,
                },
                children: [
                    {
                        tag: TagTwo,
                        props: { x: 9 },
                        children: [{ tag: TagOne, props: { x: 1 } }],
                    },
                ],
            },
            m,
            mockHelper
        );
        expect(m.props.x).toBe(1);
        expect(m).toBeDefined;
        expect(m.children).toHaveLength(1);
        expect(m.children[0].props.x).toBe(9);
        expect(m.children[0].tagName).toBe("TagTwo");
    });

    it("remove children", () => {
        const initial = {
            tag: TagOne,
            props: { x: 0 },
            children: [
                { tag: TagOne, props: { x: 3 } },
                { tag: TagOne, props: { x: 1 } },
                { tag: VirtualTag, props: { x: 1 } },
            ],
        };
        const m = create<undefined, MockContainer>(
            undefined,
            initial,
            mockHelper
        );
        if (!m) {
            fail("error");
        }
        const oldFirstChild = m.children[0];
        reconcile<undefined, MockContainer>(
            undefined,
            initial,
            {
                tag: TagOne,
                props: {
                    x: 1,
                },
                children: [{ tag: TagOne, props: { x: 9 } }],
            },
            m,
            mockHelper
        );
        const newFirstChild = m.children[0];
        expect(oldFirstChild === newFirstChild).toBeTruthy();
        expect(m.props.x).toBe(1);
        expect(m).toBeDefined;
        expect(m.children).toHaveLength(1);
        expect(m.children[0].props.x).toBe(9);

        expect(dispose).toBeCalledTimes(1);
    });
    it("switch child", () => {
        const initial = {
            tag: TagOne,
            props: { x: 0 },
            children: [{ tag: TagOne, props: { x: 3 } }],
        };
        const m = create<undefined, MockContainer>(
            undefined,
            initial,
            mockHelper
        );
        if (!m) {
            fail("error");
        }
        reconcile<undefined, MockContainer>(
            undefined,
            initial,
            {
                tag: TagOne,
                props: {
                    x: 1,
                },
                children: [{ tag: TagTwo, props: { x: 9 } }],
            },
            m,
            mockHelper
        );
        expect(m.props.x).toBe(1);
        expect(m).toBeDefined;
        expect(m.children).toHaveLength(1);
        expect(m.children[0].props.x).toBe(9);
        expect(m.children[0].tagName).toBe("TagTwo");
    });
    it("virtual", () => {
        const initial = {
            tag: VirtualTag,
            props: {},
        };
        const m = create<undefined, MockContainer>(
            undefined,
            initial,
            mockHelper
        );
        if (!m) {
            fail("error");
        }
        reconcile<undefined, MockContainer>(
            undefined,
            initial,
            {
                tag: VirtualTag,
                props: {},
            },
            m,
            mockHelper
        );
        expect(m).toBeDefined;
        expect(m.props.x).toBe(5);
    });
    it("change virtual children", () => {
        const initial = {
            tag: TagOne,
            props: {
                x: 0,
            },
            children: [{ tag: VirtualTag, props: { x: 3 } }],
        };
        const m = create<undefined, MockContainer>(
            undefined,
            initial,
            mockHelper
        );
        if (!m) {
            fail("error");
        }
        reconcile<undefined, MockContainer>(
            undefined,
            initial,
            {
                tag: TagOne,
                props: {
                    x: 1,
                },
                children: [
                    {
                        tag: VirtualTag,
                        props: {
                            x: 12,
                            y: 2,
                        },
                        children: [{ tag: TagOne, props: { x: 1 } }],
                    },
                ],
            },
            m,
            mockHelper
        );
        expect(m.children).toHaveLength(1);
        expect(m.children[0].props.y).toBe(2);
        expect(m.children[0].children).toHaveLength(1);
    });
    it("change state", () => {
        let myCb: (x: number) => void = () => {};
        const listen = (cb: (x: number) => void) => {
            myCb = cb;
        };
        const initial = {
            tag: VirtualTag,
            props: { listen },
        };
        const stateChange = jest.fn();
        globalState.current?.onStateChange(stateChange);
        const m = create<undefined, MockContainer>(
            undefined,
            initial,
            mockHelper
        );
        if (!m) {
            fail("error");
        }
        myCb(10);
        reconcile(undefined, initial, initial, m, mockHelper);
        expect(m.props.x).toBe(10);
        myCb(12);
        reconcile(undefined, initial, initial, m, mockHelper);
        expect(m.props.x).toBe(12);
    });
});
