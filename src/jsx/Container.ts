import Phaser, { Scene } from "phaser";
import { Tag } from "@dragonquest/jsx/src/jsx-runtime";
import { Ref } from "@dragonquest/jsx/jsx-runtime";

export interface ContainerProps {
    x?: number;
    y?: number;
    ref?: ((gameObject: any) => void) | Ref<any> ;
}

export const Container: Tag<ContainerProps> = () => ({
    create(scene: Scene, props: ContainerProps) {
        const { x, y } = props;
        return new Phaser.GameObjects.Container(scene, x, y);
    },
    update(container: Phaser.GameObjects.Container, props: ContainerProps) {
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
