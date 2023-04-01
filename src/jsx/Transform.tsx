import { Element, useEffect, useRef } from "@dragonquest/jsx/jsx-runtime";
import { GameObjects, Tweens } from "phaser";
import { Container } from "./Container";
import { getName } from "./utils";

export interface TransformStep {
    scale: number;
    x: number;
    y: number;
}

export interface TransformProps {
    x?: number;
    y?: number;
    children?: Element<any>[];
    mode: "in" | "out";
    step: TransformStep;
    name?: string;
    delay?: number;
}
export const Transform = (props: TransformProps) => {
    const ref = useRef<GameObjects.Container>();

    useEffect(() => {
        let tween: Tweens.Tween | undefined = undefined;
        if (ref.current) {
            const deltaX = props.mode == "in" ? props.step.x : 0;
            const deltaY = props.mode == "in" ? props.step.y : 0;
            const deltaScale = props.mode == "in" ? props.step.scale : 1;

            const config = {
                targets: ref.current,
                x: deltaX,
                y: deltaY,
                delay: props.delay || 0,
                scale: deltaScale,
                ease: "Power1",
                duration: 300,
            } as any;

            tween = ref.current.scene.tweens.add(config);
        }

        return () => {
            if (tween) {
                tween.remove();
            }
        };
    }, [props.mode]);

    return (
        <Container name={props.name} x={props.x} y={props.y} ref={ref}>
            {props.children}
        </Container>
    );
};
