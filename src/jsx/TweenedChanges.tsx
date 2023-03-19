import { Element, Ref, useEffect, useRef } from "@dragonquest/jsx/jsx-runtime";
import { GameObjects, Tweens } from "phaser";
import { Container } from "./Container";
import { getName } from "./utils";

export interface TransformProps {
    objectRef: Ref<GameObjects.GameObject>;
    children?: (width: number) => Element<any>[] | Element<any>;
    width: number;
    name: string;
}
export const TweenedChanges = (props: TransformProps) => {
    //const currentWidth = useRef(props.width);
    const { children, objectRef } = props;
    const currentWidth = useRef(props.width)

    useEffect(() => {
        let tween: Tweens.Tween | undefined = undefined;
        if (objectRef.current) {
            const config = {
                targets: objectRef.current,
                width: props.width,
                ease: "Power1",
                duration: 3000,
                onComplete: () => {
                    currentWidth.current=props.width
                },
            } as any;

            tween = objectRef.current.scene.tweens.add(config);
        }

        return () => {
            if (tween) {
                tween.remove();
            }
        };
    }, [props.width]);

    if (!children) {
        return <Container></Container>
    }

    // TODO fix the
    return <Container>{(children as any)[0](currentWidth.current)}</Container>;
};
