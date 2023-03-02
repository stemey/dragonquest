import { Tag } from "@dragonquest/jsx/jsx-runtime";
import { GameObjects, Scene } from "phaser";
import { RectangleProps } from "./Rectangle";

export class RectangleHolder {
    public graphics: GameObjects.Graphics | undefined;
    constructor(
        public props: Phaser.Geom.Rectangle,
        public fillColor?: number,
        public fillAlpha?: number
    ) {}
    render() {
        if (this.graphics) {
            if (this.fillColor && this.fillAlpha) {
                this.graphics.fillStyle(this.fillColor, this.fillAlpha);
                this.graphics.alpha = this.fillAlpha;
            }
            this.graphics.fillRectShape(this.props);
        }
    }
}

export const LwRectangle: Tag<RectangleProps> = () => ({
    create(scene: Scene, props: RectangleProps) {
        return new RectangleHolder(
            new Phaser.Geom.Rectangle(
                props.x,
                props.y,
                props.width,
                props.height
            ),
            props.fillColor,
            props.fillAlpha
        );
    },
    update(rectangle: RectangleHolder, props: RectangleProps) {
        rectangle.props = new Phaser.Geom.Rectangle(
            props.x,
            props.y,
            props.width,
            props.height
        );
        rectangle.render();
        return false;
    },
});
