import { GraphicsTexture } from "../../jsx/graphics/GraphicsTexture";
import { LwRectangle } from "../../jsx/graphics/LwRectangle";

export interface Border1Options {
    indent: number;
   
}

const generateCorners = (callback: (vec: number[]) => Element) => {
    return [
        [-1, 1],
        [1, 1],
        [1, -1],
        [-1, -1],
    ].flatMap((vec) => callback(vec));
};

export const Border1 = (props: {
    width: number;
    height: number;
    fillColor: number;
    lineColor: number;
    options: Border1Options;
}) => {
    const { width, height, options, lineColor, fillColor } = props;
    const lineStyle = { color: lineColor, lineWidth: 1 };

    const decorators = generateCorners((vec) => {
        const dx = 0.5 * options.indent;
        const dy = 0.5 * options.indent;
        const recWidth = 1.5 * options.indent;
        const recHeight = 1.5 * options.indent;

        return (
            <LwRectangle
                x={
                    width / 2 -
                    recWidth / 2 +
                    (width / 2 - recWidth / 2 - dx) * vec[0]
                }
                y={
                    height / 2 -
                    recHeight / 2 +
                    (height / 2 - recHeight / 2 - dy) * vec[1]
                }
                height={recHeight}
                width={recWidth}
                lineStyle={lineStyle}
            />
        );
    });
    const decorators2 = generateCorners((vec) => {
        const dx = 0;
        const dy = 0;
        const recWidth = 1 * options.indent;
        const recHeight = 1 * options.indent;

        return (
            <LwRectangle
                x={
                    width / 2 -
                    recWidth / 2 +
                    (width / 2 - recWidth / 2 - dx) * vec[0]
                }
                y={
                    height / 2 -
                    recHeight / 2 +
                    (height / 2 - recHeight / 2 - dy) * vec[1]
                }
                height={recHeight}
                width={recWidth}
                lineStyle={lineStyle}
            />
        );
    });

    return (
        <GraphicsTexture width={width} height={height}>
            <LwRectangle
                x={options.indent}
                y={options.indent}
                height={height - 2 * options.indent}
                width={width - 2 * options.indent}
                lineStyle={lineStyle}
            />
            <LwRectangle
                x={1.5 * options.indent}
                y={1.5 * options.indent}
                height={height - 3 * options.indent}
                width={width - 3 * options.indent}
                lineStyle={lineStyle}
                fillColor={fillColor}
            />
            {decorators}
            {decorators2}
        </GraphicsTexture>
    );
};
