import { ContainerHelper } from "@dragonquest/jsx/jsx-runtime";
import { GameObjects } from "phaser";
import { JsxContainer } from "./JsxContainer";

export const phaserJsxHelper: ContainerHelper<GameObjects.Container> = {
    remove: function (gameObject: GameObjects.Container, idx: number): void {
        gameObject.remove(gameObject.getAt(idx), true);
    },
    move: function (
        gameObject: GameObjects.Container,
        oldIdx: number,
        newIdx: number
    ): void {
        gameObject.moveTo(gameObject.getAt(oldIdx), newIdx);
    },
    add: function (
        parent: GameObjects.Container,
        child: GameObjects.GameObject
    ): void {
        parent.add(child);
    },
    get: function (parent: GameObjects.Container, idx: number) {
        if (!parent) {
            return undefined as any;
        }
        if ("getAtJsx" in parent) {
            return (parent as JsxContainer).getAtJsx(idx);
        }
        return parent.getAt(idx) as unknown as GameObjects.Container;
    },
};
