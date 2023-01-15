import Phaser, { Scene } from "phaser";
import { Tag } from "@dragonquest/jsx/src/jsx-runtime";

export interface ContainerProps {
    x: number;
    y: number;
}

export const Container: Tag<ContainerProps> = () => ({
    create(scene: Scene, props: ContainerProps) {
        const { x, y } = props;
        return new Phaser.GameObjects.Container(scene, x, y);
    },
    update(container: Phaser.GameObjects.Container, props: ContainerProps) {
        const { x, y } = props;
        container.setX(x);
        container.setY(y);
    },
});
