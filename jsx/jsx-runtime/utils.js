export const create = (scene, element) => {
    return evaluateTag(scene, element);
};
const evaluateTag = (scene, element) => {
    const creator = element.tag(element.props);
    if ("update" in creator && "create" in creator) {
        const gameObject = creator.create(scene, element.props);
        if (element.children &&
            "add" in gameObject &&
            typeof gameObject.add === "function") {
            element.children.forEach((c) => {
                const child = create(scene, c);
                gameObject.add(child);
            });
        }
        return gameObject;
    }
    return evaluateTag(scene, creator);
};
export const reconcile = (scene, old, nu, gameObject) => {
    const creator = nu.tag(nu.props);
    if ("update" in creator && "create" in creator) {
        creator.update(gameObject, nu.props);
        if (nu.children &&
            "add" in gameObject &&
            typeof gameObject.add === "function") {
            nu.children.forEach((c, idx) => {
                const childGo = gameObject.getAt(idx);
                reconcile(scene, undefined, c, childGo);
            });
        }
        return gameObject;
    }
    reconcile(scene, undefined, creator, gameObject);
};
//# sourceMappingURL=utils.js.map