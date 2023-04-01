import { Ref, useEffect } from "@dragonquest/jsx/jsx-runtime";
import { GameObjects } from "phaser";
import { useTween } from "../../../jsx/useTween";

export const useShatter = (props: {
    objectRef: Ref<GameObjects.GameObject>;
    active: boolean;
}) => {
    const tween = useTween({
        config: {
            duration: 80,
            x: 5,
            y: 3,
            yoyo: true,
            repeat: 3,
            ease: "Power1",
            paused: true,
            delay: 300,
        },
        objectRef: props.objectRef,
    });
    useEffect(() => {
        if (props.active && tween.current && tween.current.paused) {
            tween.current.play();
        }
    }, [props.active, tween.current]);

    useEffect(() => {
        return () => {
            if (tween.current) {
                tween.current.remove();
            }
        };
    }, [tween]);
};
