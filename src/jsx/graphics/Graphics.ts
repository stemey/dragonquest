import Phaser, { Scene } from "phaser";
import { Tag } from "@dragonquest/jsx/src/jsx-runtime";
import { Ref } from "@dragonquest/jsx/jsx-runtime";
import { GraphicsContainer } from "./GraphicsContainer";

export interface GraphicsProps {
    x?: number;
    y?: number;
    ref?: ((graphics: Phaser.GameObjects.Graphics) => void) | Ref<Phaser.GameObjects.Graphics>;
}

export const Graphics: Tag<GraphicsProps> = () => ({
    create(scene: Scene, props: GraphicsProps) {
        const { x, y } = props;
        return new GraphicsContainer(scene, { x: x, y: y });
    },
    update(container: GraphicsContainer, props: GraphicsProps) {
        // x and y could also be set by parent.
        const { x, y } = props;
        if (x) {
            container.setX(x);
        }
        if (y) {
            container.setY(y);
        }
        return false;
    },
});
