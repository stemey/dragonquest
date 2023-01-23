import { isArrayLike } from "mobx";
import { Element } from "./Element";
import { GlobalState } from "./GlobalState";

export const create = <S, T>(
    scene: S,
    element: Element<any>,
    helper: ContainerHelper<T>,
    currentId: string = ""
) => {
    return evaluateTag(scene, element, helper, currentId);
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
    if (!currentId) {
        currentId = createId(element);
    }
    currentState.currentElementId = currentId;
    const creator = element.tag(element.props);
    currentState.currentElementState?.onCreated();
    if ("update" in creator && "create" in creator) {
        const gameObject = creator.create(scene, element.props);
        handleRef(element, gameObject);

        if (element.children) {
            let children = element.children;
            if (!Array.isArray(element.children)) {
                children = [element.children as unknown as Element<any>];
            }
            children.forEach((c, idx) => {
                const newId = currentId + createId(c, idx);
                currentState.currentElementId = newId;
                const child = create(scene, c, helper, newId);
                helper.add(gameObject, child);
            });
        }
        return gameObject;
    }
    // TODO what about children here? And need to add new tag

    return evaluateTag(
        scene,
        creator as Element<any>,
        helper,
        currentId + createId(creator)
    );
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
    if (!currentId) {
        currentId = createId(nu);
    }
    currentState.currentElementId = currentId;
    const creator = nu.tag(nu.props);
    if ("update" in creator && "create" in creator) {
        const rerender = creator.update(gameObject, nu.props);
        if (rerender && globalState.current) {
            globalState.current.rerender=true;
        }
        handleRef(nu, gameObject);

        if (nu.children) {
            let children = nu.children;
            if (!Array.isArray(nu.children)) {
                children = [nu.children as unknown as Element<any>];
            }
            let oldElementChildren = old?.children;
            if (!Array.isArray(old?.children)) {
                oldElementChildren = [old?.children as unknown as Element<any>];
            }
            const oldChildren =
                oldElementChildren?.map(
                    (c, idx) => currentId + createId(c, idx)
                ) || [];
            const newChildren =
                children.map((c, idx) => currentId + createId(c, idx)) || [];
            const toBeRemoved = oldChildren
                .map((key, idx) => ({ key, idx }))
                .filter((data) => newChildren.indexOf(data.key) < 0)
                .map((data) => data.idx)
                .sort()
                .reverse();
            toBeRemoved.forEach((idx) => {
                helper.remove(gameObject, idx);

                const removed = oldChildren.splice(idx, 1);
                const elementState = globalState.current?.stateMap.get(
                    removed[0]
                );
                elementState?.destroy();
            });
            children.forEach((c, idx) => {
                const newId = currentId + createId(c, idx);
                const oldIdx = oldChildren.indexOf(newId);
                if (oldIdx < 0) {
                    const newObject = create(scene, c, helper, newId);
                    helper.add(gameObject, newObject);
                } else {
                    if (oldIdx !== idx) {
                        helper.move(gameObject, oldIdx, idx);
                    }
                    const childGo = helper.get(gameObject, oldIdx);
                    currentState.currentElementId = newId;
                    reconcile(scene, c, c, childGo, helper, newId);
                }
            });
        }
        return gameObject;
    }
    reconcile(
        scene,
        creator,
        creator as Element<any>,
        gameObject,
        helper,
        currentId + createId(creator)
    );
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

    function renderInternally(){
        while (globalState.rerender) {
            globalState.rerender=false;
    
            wrapInGlobalState(globalState, () => {
                reconcile(scene, element, element, value, helper);
            });
        }
    }

    renderInternally();

    globalState.onStateChange(() => {
        renderInternally();
     });
    

    return value;
};



export const globalState: { current: GlobalState | undefined } = {
    current: undefined,
};

export const wrapInGlobalState = <T>(g: GlobalState, cb: () => T): T => {
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
const handleRef = <T>(el: Element<any>, gameObject: T) => {
    if (el.props.ref) {
        if (typeof el.props.ref === "function") {
            el.props.ref(gameObject);
        } else {
            el.props.ref.current = gameObject;
        }
    }
};
