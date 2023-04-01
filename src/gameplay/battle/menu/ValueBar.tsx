import { useRef } from "@dragonquest/jsx/jsx-runtime";
import { GameObjects } from "phaser";
import { Container } from "../../../jsx/Container";
import { Div } from "../../../jsx/div/Div";
import { Rectangle } from "../../../jsx/Rectangle";
import { Text } from "../../../jsx/Text";
import { useTween } from "../../../jsx/useTween";

export interface ValueBarProps {
    value: number;
    maxValue: number;
    emptyColor: number;
    fillColor: number;
    x?: number;
    y?: number;
    height?: number;
    width?: number;
}

export const ValueBar = (props: ValueBarProps) => {
    const { value, maxValue } = props;

    const rectRef = useRef<GameObjects.Rectangle>();

    const valueWidth = Math.trunc(((props.width || 0) * value) / maxValue);
    const currentWidth =
        useTween({ objectRef: rectRef, width: valueWidth }) || 0;

    return (
        <Container
            height={props.height}
            width={props.width}
            x={props.x}
            y={props.y}
        >
            <Rectangle
                width={props.width || 0}
                x={0}
                y={0}
                height={props.height || 0}
                fillAlpha={1}
                fillColor={props.emptyColor}
            />

            <Rectangle
                ref={rectRef}
                width={currentWidth}
                x={0}
                y={0}
                height={props.height || 0}
                fillAlpha={1}
                fillColor={props.fillColor}
            ></Rectangle>
            <Text
                y={(props.height || 0) / 2}
                style={{
                    fixedHeight: props.height,
                    align: "left",
                    fontSize: "6",
                }}
                text={`${value}`}
            />
        </Container>
    );
};
