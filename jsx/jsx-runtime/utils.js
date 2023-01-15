import { GlobalState } from "./GlobalState";
export const create = (scene, element, helper) => {
    return evaluateTag(scene, element, helper);
};
const evaluateTag = (scene, element, helper, currentId = "") => {
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
    return evaluateTag(scene, creator, helper);
};
export const reconcile = (scene, old, nu, gameObject, helper, currentId = "") => {
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
            const oldChildren = old?.children?.map((c, idx) => currentId + createId(c, idx)) ||
                [];
            const newChildren = nu?.children?.map((c, idx) => currentId + createId(c, idx)) ||
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
                }
                else {
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
    reconcile(scene, undefined, creator, gameObject, helper);
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
    globalState.onStateChange(() => {
        wrapInGlobalState(globalState, () => {
            reconcile(scene, element, element, value, helper);
        });
    });
    return value;
};
export const globalState = {
    current: undefined,
};
const wrapInGlobalState = (g, cb) => {
    globalState.current = g;
    const returnValue = cb();
    globalState.current = undefined;
    return returnValue;
};
//# sourceMappingURL=utils.js.map