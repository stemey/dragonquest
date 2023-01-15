import { Scene } from "phaser";
import { Element } from "./Element";
import { GlobalState } from "./GlobalState";

export const create = (scene: Scene, element: Element<any>) => {
    return evaluateTag(scene, element);
};

const evaluateTag = <P extends object, T extends Phaser.GameObjects.GameObject>(
    scene: Scene,
    element: Element<any>
): T => {
    const creator = element.tag(element.props);
    if ("update" in creator && "create" in creator) {
        const gameObject = creator.create(scene, element.props);
        if (
            element.children &&
            "add" in gameObject &&
            typeof gameObject.add === "function"
        ) {
            element.children.forEach((c) => {
                const child = create(scene, c);
                (gameObject as Phaser.GameObjects.Container).add(child);
            });
        }
        return gameObject;
    }
    return evaluateTag(scene, creator as Element<any>);
};

export const reconcile = (
    scene: Scene,
    old: Element<any> | undefined,
    nu: Element<any>,
    gameObject: Phaser.GameObjects.GameObject
) => {
    const creator = nu.tag(nu.props);
    if ("update" in creator && "create" in creator) {
        creator.update(gameObject, nu.props);
        if (
            nu.children &&
            "add" in gameObject &&
            typeof gameObject.add === "function"
        ) {
            nu.children.forEach((c, idx) => {
                const childGo = (
                    gameObject as Phaser.GameObjects.Container
                ).getAt(idx);
                reconcile(scene, undefined, c, childGo);
            });
        }
        return gameObject;
    }
    reconcile(scene, undefined, creator as Element<any>, gameObject);
};

export const render = (scene: Scene, element: Element<any>) => {
    const globalState = new GlobalState();
    const value = create(scene, element);
    //globalState.onStateChange(reconcile());
    return value;
};
