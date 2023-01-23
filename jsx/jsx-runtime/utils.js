import { GlobalState } from "./GlobalState";
export const create = (scene, element, helper, currentId = "") => {
    return evaluateTag(scene, element, helper, currentId);
};
const evaluateTag = (scene, element, helper, currentId = "") => {
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
                children = [element.children];
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
    return evaluateTag(scene, creator, helper, currentId + createId(creator));
};
export const reconcile = (scene, old, nu, gameObject, helper, currentId = "") => {
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
            globalState.current.rerender = true;
        }
        handleRef(nu, gameObject);
        if (nu.children) {
            let children = nu.children;
            if (!Array.isArray(nu.children)) {
                children = [nu.children];
            }
            let oldElementChildren = old?.children;
            if (!Array.isArray(old?.children)) {
                oldElementChildren = [old?.children];
            }
            const oldChildren = oldElementChildren?.map((c, idx) => currentId + createId(c, idx)) || [];
            const newChildren = children.map((c, idx) => currentId + createId(c, idx)) || [];
            const toBeRemoved = oldChildren
                .map((key, idx) => ({ key, idx }))
                .filter((data) => newChildren.indexOf(data.key) < 0)
                .map((data) => data.idx)
                .sort()
                .reverse();
            toBeRemoved.forEach((idx) => {
                helper.remove(gameObject, idx);
                const removed = oldChildren.splice(idx, 1);
                const elementState = globalState.current?.stateMap.get(removed[0]);
                elementState?.destroy();
            });
            children.forEach((c, idx) => {
                const newId = currentId + createId(c, idx);
                const oldIdx = oldChildren.indexOf(newId);
                if (oldIdx < 0) {
                    const newObject = create(scene, c, helper, newId);
                    helper.add(gameObject, newObject);
                }
                else {
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
    reconcile(scene, creator, creator, gameObject, helper, currentId + createId(creator));
};
function createId(element, idx) {
    if (typeof idx !== "undefined") {
        return element.tag.name + (element.props.key || String(idx));
    }
    return element.tag.name;
}
export const render = (scene, element, helper) => {
    const globalState = new GlobalState();
    const value = wrapInGlobalState(globalState, () => create(scene, element, helper));
    function renderInternally() {
        while (globalState.rerender) {
            globalState.rerender = false;
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
export const globalState = {
    current: undefined,
};
export const wrapInGlobalState = (g, cb) => {
    globalState.current = g;
    const returnValue = cb();
    globalState.current = undefined;
    return returnValue;
};
const handleRef = (el, gameObject) => {
    if (el.props.ref) {
        if (typeof el.props.ref === "function") {
            el.props.ref(gameObject);
        }
        else {
            el.props.ref.current = gameObject;
        }
    }
};
//# sourceMappingURL=utils.js.map