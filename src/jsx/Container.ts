import Phaser, { GameObjects, Scene } from "phaser";
import { Tag } from "@dragonquest/jsx/src/jsx-runtime";
import { Ref } from "@dragonquest/jsx/jsx-runtime";

export interface ContainerProps {
    x?: number;
    y?: number;
    ref?: ((gameObject: any) => void) | Ref<any>;
    top?: GameObjects.GameObject;
    name?: string;
}

export const Container: Tag<ContainerProps> = () => ({
    create(scene: Scene, props: ContainerProps) {
        const { x, y } = props;
        const container = new Phaser.GameObjects.Container(scene, x, y);
        if (props.name) container.setName(props.name);
        return container;
    },
    update(container: Phaser.GameObjects.Container, props: ContainerProps) {
        // x and y could also be set by parent.
        const { x, y } = props;

        if (!!x || !!y) {
            container.setPosition(x || 0, y || 0);

        }

        if (props.top) {
            container.bringToTop(props.top);
        }
        return false;
    },
});
