import { Element } from "./Element";
import { GlobalState } from "./GlobalState";

export const create = <S, T>(
    scene: S,
    element: Element<any>,
    helper: ContainerHelper<T>
) => {
    return evaluateTag(scene, element, helper);
};

const evaluateTag = <S, P extends object, T>(
    scene: S,
    element: Element<any>,
    helper: ContainerHelper<T>,
    currentId: string = ""
): T => {
    const currentState = globalState.current;
    if (!currentState) {
        throw new Error("global state not set");
    }
    currentId = currentId || createId(element);
    currentState.currentElementId = currentId;
    const creator = element.tag(element.props);
    if ("update" in creator && "create" in creator) {
        const gameObject = creator.create(scene, element.props);
        if (element.children) {
            element.children.forEach((c, idx) => {
                const newId = currentId + createId(element, idx);
                currentState.currentElementId = newId;
                const child = create(scene, c, helper);
                helper.add(gameObject, child);
            });
        }
        return gameObject;
    }
    return evaluateTag(scene, creator as Element<any>, helper);
};

export const reconcile = <S, G extends object>(
    scene: S,
    old: Element<any> | undefined,
    nu: Element<any>,
    gameObject: G,
    helper: ContainerHelper<G>,
    currentId: string = ""
) => {
    const currentState = globalState.current;
    if (!currentState) {
        throw new Error("global state not set");
    }
    currentId = currentId || createId(nu);
    currentState.currentElementId = currentId;
    const creator = nu.tag(nu.props);
    if ("update" in creator && "create" in creator) {
        creator.update(gameObject, nu.props);
        if (nu.children) {
            const oldChildren =
                old?.children?.map((c, idx) => currentId + createId(c, idx)) ||
                [];
            const newChildren =
                nu?.children?.map((c, idx) => currentId + createId(c, idx)) ||
                [];
            const toBeRemoved = oldChildren
                .map((key, idx) => ({ key, idx }))
                .filter((data) => newChildren.indexOf(data.key) < 0)
                .map((data) => data.idx)
                .sort()
                .reverse();
            toBeRemoved.forEach((idx) => {
                helper.remove(gameObject, idx);
                oldChildren.splice(idx, 1);
            });
            nu.children.forEach((c, idx) => {
                const newId = currentId + createId(c, idx);
                const oldIdx = oldChildren.indexOf(newId);
                if (oldIdx < 0) {
                    const newObject = create(scene, c, helper);
                    helper.add(gameObject, newObject);
                } else {
                    if (oldIdx !== idx) {
                        helper.move(gameObject, oldIdx, idx);
                    }
                    const childGo = helper.get(gameObject, oldIdx);
                    currentState.currentElementId = newId;
                    reconcile(scene, undefined, c, childGo, helper, newId);
                }
            });
        }
        return gameObject;
    }
    reconcile(scene, undefined, creator as Element<any>, gameObject, helper);
};

function createId(element: Element<any>, idx?: number): string {
    if (typeof idx !== "undefined") {
        return element.tag.name + (element.props.key || String(idx));
    }
    return element.tag.name;
}

export const render = <S, G extends object>(
    scene: S,
    element: Element<any>,
    helper: ContainerHelper<G>
) => {
    const globalState = new GlobalState();
    const value = wrapInGlobalState(globalState, () =>
        create(scene, element, helper)
    );
    globalState.onStateChange(() => {
        wrapInGlobalState(globalState, () => {
            reconcile(scene, element, element, value, helper);
        });
    });
    return value;
};

export const globalState: { current: GlobalState | undefined } = {
    current: undefined,
};

const wrapInGlobalState = <T>(g: GlobalState, cb: () => T): T => {
    globalState.current = g;
    const returnValue = cb();
    globalState.current = undefined;
    return returnValue;
};

export interface ContainerHelper<G> {
    remove(gameObject: G, idx: number): void;
    move(gameObject: G, oldIdx: number, newIdx: number): void;
    add(parent: G, child: G): void;
    get(parent: G, idx: number): G;
}
