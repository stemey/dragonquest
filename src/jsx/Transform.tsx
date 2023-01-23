import { Element, useEffect, useRef } from "@dragonquest/jsx/jsx-runtime";
import { GameObjects, Tweens } from "phaser";
import { Container } from "./Container";

export interface TransformProps {
    x?: number;
    y?: number;
    children?: Element<any>[];
    mode: "in" | "out";
}
export const Transform = (props: TransformProps) => {
    const ref = useRef<GameObjects.Container>();

    useEffect(() => {
        let tween: Tweens.Tween | undefined = undefined;
        if (ref.current) {
            const deltaX = props.mode == "in" ? 10 : 0;
            tween = ref.current.scene.tweens.add({
                targets: ref.current,
                x:deltaX,
                ease: "Power1",
                duration: 300,
            });
        }

        return () => {
            if (tween) {
                tween.remove();
            }
        };
    }, [props.mode]);

    return (
        <Container x={props.x} y={props.y} ref={ref}>
            {props.children}
        </Container>
    );
};
