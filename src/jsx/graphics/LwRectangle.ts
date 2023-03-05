import { useEffect } from "@dragonquest/jsx/jsx-runtime";
import { RectangleProps } from "../Rectangle";

export interface LineStyle {
    lineWidth: number;
    color: number;
    alpha?: number;
}

export interface LwRectangleProps {
    width: number;
    height: number;
    fillColor?: number;
    fillAlpha?: number;
    x: number;
    y: number;
    lineStyle?: LineStyle
}



export const LwRectangle = (
    props: LwRectangleProps & { graphics?: Phaser.GameObjects.Graphics }
) => {
    const { graphics, x, y, width, height, fillColor, fillAlpha, lineStyle } = props;

    useEffect(() => {
        if (graphics) {
            if (fillColor) {
                graphics.fillStyle(fillColor, fillAlpha);
                graphics.fillRect(x, y, width, height);
            }
            if (lineStyle) {
                graphics.lineStyle(lineStyle.lineWidth,lineStyle.color,lineStyle.alpha)
                graphics.strokeRect(x, y, width, height);
            }
        }
    }, [graphics]);

    return undefined;
};
