import { GameObjects } from "phaser";

export const setWidth = (
    gameObject: Phaser.GameObjects.GameObject,
    width?: number
) => {
    if (!width) {
        return;
    }
    const bounds = getBounds(gameObject);
    if (!bounds) {
        return;
    }
    setScale(gameObject, width / bounds.width);
};

export const setScale = (
    gameObject: Phaser.GameObjects.GameObject,
    factor: number
) => {
    if ("setScale" in gameObject) {
        return (
            gameObject as unknown as Phaser.GameObjects.Components.Transform
        ).setScale(factor);
    }
    return undefined;
};

export const getBounds = (gameObject: Phaser.GameObjects.GameObject) => {
    if ("getBounds" in gameObject) {
        return (
            gameObject as unknown as Phaser.GameObjects.Components.GetBounds
        ).getBounds();
    }
    return undefined;
};

export const getName = (container: GameObjects.GameObject) => {
    const paths: string[] = [];
    do {
        paths.push(container.name || "none");
        container=container.parentContainer;
    } while (container);
    return paths.join("/");
};

export const setPosition = (
    gameObject: Phaser.GameObjects.GameObject,
    x?: number,
    y?: number
) => {
    if ("setX" in gameObject) {
        const transform =
            gameObject as unknown as Phaser.GameObjects.Components.Transform;
        if (x) {
            transform.setX(x);
        }
        if (y) {
            transform.setY(y);
        }
    }
};
