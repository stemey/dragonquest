import { Scene } from "phaser";

export interface JsxContext {
    wrapHandler: (handler: () => void) => void;
}

export interface GameObjectFactory<P extends object, T, S> {
    create(scene: S, props: P, ctx: JsxContext): T;

    update(gameObject: T, props: P): boolean;
}
