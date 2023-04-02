import { Ref, useEffect, useRef } from "@dragonquest/jsx/jsx-runtime";
import { GameObjects, Tweens } from "phaser";
import { AnimationTiming } from "../gameplay/battle/menu/AnimationTiming";

export interface TransformProps {
    objectRef: Ref<GameObjects.GameObject>;
    width: number;
}
export const useWidthTween = (props: TransformProps) => {
    //const currentWidth = useRef(props.width);
    const { objectRef } = props;
    const currentWidth = useRef(props.width);

    useEffect(() => {
        let tween: Tweens.Tween | undefined = undefined;
        if (objectRef.current) {
            const config = {
                targets: objectRef.current,
                width: props.width,
                ease: "Power1",
                delay: AnimationTiming.defenseDelay,
                duration: 500,
                onComplete: () => {
                    currentWidth.current = props.width;
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

    return currentWidth.current;
};
