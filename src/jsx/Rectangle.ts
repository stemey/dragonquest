import { Tag } from "@dragonquest/jsx/jsx-runtime";
import { reaction } from "mobx";
import { GameObjects, Scene } from "phaser";

export interface RectangleProps {
    width: number;
    height: number;
    fillColor?: number;
    fillAlpha?: number;
    x: number;
    y: number;
    onPointerDown?: () => void;
}

export const Rectangle: Tag<RectangleProps> = () => ({
    create(scene: Scene, props: RectangleProps) {
        const rect = new GameObjects.Rectangle(
            scene,
            props.x + props.width / 2,
            props.y + props.height / 2,
            props.width,
            props.height,
            props.fillColor,
            props.fillAlpha
        );
        if (props.onPointerDown) {
            rect.setInteractive();
            rect.on("pointerdown", props.onPointerDown);
        }

        return rect;
    },
    update(rectangle: GameObjects.Rectangle, props: RectangleProps) {
        rectangle.setPosition(
            props.x + props.width / 2,
            props.y + props.height / 2
        );
        rectangle.updateDisplayOrigin();
        rectangle.setSize(props.width, props.height);
        rectangle.setFillStyle(props.fillColor, props.fillAlpha);
        rectangle.setVisible(props.fillAlpha !== 0);

        return false;
    },
});
