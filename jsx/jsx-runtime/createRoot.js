export const create = (scene, element) => {
    const creator = evaluateTag(element);
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
};
const evaluateTag = (element) => {
    const result = element.tag(element.props);
    if ("update" in result && "create" in result) {
        return result;
    }
    return evaluateTag(result);
};
export const reconcile = (old, nu, gameObject) => {
    const creator = evaluateTag(nu);
    // TODO remove old if it isn't the same creator?
    creator.update(gameObject, nu.props);
    if (gameObject instanceof Phaser.GameObjects.Container) {
        const container = gameObject;
        nu.children?.forEach((c, index) => reconcile(undefined, c, container.getAt(index)));
    }
    // TOD diff children by creator and otherwise index/key
};
//# sourceMappingURL=createRoot.js.map