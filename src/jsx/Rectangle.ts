import { Tag } from "@dragonquest/jsx/jsx-runtime";
import { GameObjects, Scene } from "phaser";

export interface RectangleProps {
    width: number;
    height: number;
    fillColor?: number;
    fillAlpha?: number;
    x: number;
    y: number;
}

export const Rectangle: Tag<RectangleProps> = () => ({
    create(scene: Scene, props: RectangleProps) {
        return new GameObjects.Rectangle(
            scene,
            props.x + props.width / 2,
            props.y + props.height / 2,
            props.width,
            props.height,
            props.fillColor,
            props.fillAlpha
        );
    },
    update(rectangle: GameObjects.Rectangle, props: RectangleProps) {
        rectangle.setPosition(
            props.x + props.width / 2,
            props.y + props.height / 2
        );
        rectangle.updateDisplayOrigin();
        rectangle.setSize(props.width, props.height);
        return false;
    },
});
