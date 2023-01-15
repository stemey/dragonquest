import { GameObjectFactory } from "../gameObjectFactory";
import { Props } from "../jsx-runtime";
import { ContainerHelper } from "../utils";

export class MockContainer {
    constructor(
        public children: MockContainer[] = [],
        public props: Props = {},
        public tagName: string
    ) {}
}

export class MockObjectFactory
    implements GameObjectFactory<any, MockContainer, undefined>
{
    constructor(public tagName: string) {}
    create(scene: undefined, props: any): MockContainer {
        return new MockContainer(props.children || [], props, this.tagName);
    }
    update(gameObject: MockContainer, props: any): void {
        gameObject.props = props;
    }
}

export const mockHelper: ContainerHelper<MockContainer> = {
    add(parent, child) {
        parent.children.push(child);
    },
    get(parent: MockContainer, idx: number): MockContainer {
        return parent.children[idx];
    },
    move(con: MockContainer, oldIdx: number, newIdx: number) {
        const removed = con.children.splice(oldIdx, 1);
        if (removed.length !== 1) {
            console.error("cannot find elements at ", oldIdx);
            return;
        }
        if (con.children.length - 1 < newIdx) {
            con.children.push(removed[0]);
        } else {
            con.children.splice(newIdx, 0, removed[0]);
        }
    },
    remove: function (con: MockContainer, idx: number): void {
        con.children.splice(idx,1);
    }
};
