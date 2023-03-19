import { useRef } from "@dragonquest/jsx/jsx-runtime";
import { GameObjects } from "phaser";
import { Container } from "../../../jsx/Container";
import { Div } from "../../../jsx/div/Div";
import { Rectangle } from "../../../jsx/Rectangle";
import { TweenedChanges } from "../../../jsx/TweenedChanges";

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
    const { value, maxValue, emptyColor, fillColor } = props;

    const valuePercentage = Math.trunc((value * 100) / maxValue);
    const rectRef = useRef<GameObjects.Rectangle>();

    const valueWidth = Math.trunc(((props.width || 0) * value) / maxValue);

    return (
        <Container
            height={props.height}
            width={props.width}
            x={props.x}
            y={props.y}
        >
            <Div
                width={props.width}
                height={props.height}
                fillColor={emptyColor}
            ></Div>
            <TweenedChanges name="tweenWidth" width={valueWidth} objectRef={rectRef}>
                {(width: number) => {
                    return (
                        <Rectangle
                            ref={rectRef}
                            width={width}
                            x={0}
                            y={0}
                            height={props.height || 0}
                            fillAlpha={1}
                            fillColor={props.fillColor}
                        />
                    );
                }}
            </TweenedChanges>
        </Container>
    );
};
