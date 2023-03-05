import { useEffect } from "@dragonquest/jsx/jsx-runtime";
import { RectangleProps } from "../Rectangle";

export const LwRectangle = (
    props: RectangleProps & { graphics?: Phaser.GameObjects.Graphics }
) => {
    const { graphics, x, y, width, height, fillColor, fillAlpha } = props;

    useEffect(() => {
        if (graphics) {
            if (fillColor) {
                graphics.fillStyle(fillColor, fillAlpha);
            }
            graphics.fillRect(x, y, width, height);
        }
    }, [graphics]);

    return undefined;
};
