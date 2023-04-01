import { Ref, useEffect, useState } from "@dragonquest/jsx/jsx-runtime";
import { GameObjects, Tweens } from "phaser";
import { useTween } from "../../../jsx/useTween";

export const useShatter = (props: {
    objectRef: Ref<GameObjects.GameObject>;
    active: boolean;
}) => {
    const [shattered, setShattered] = useState(false);
    const config = {
        duration: 20,
        yoyo: true,
        ease: "Power1",
        paused: true,
    };
    const tween = useTween({
        objectRef: props.objectRef,

        config: [
            {
                ...config,
                duration: 300,
                props: {
                    x: 0,
                    y: 0,
                },
            },
            {
                ...config,
                props: {
                    x: 4,
                    y: 1,
                },
            },
            {
                ...config,
                props: {
                    x: -3,
                    y: 1,
                },
            },
            {
                ...config,
                props: {
                    x: 0,
                    y: 5,
                },
            },
            {
                ...config,
                props: {
                    x: -2,
                    y: -2,
                },
            },
        ],
    });

    useEffect(() => {
        if (
            !shattered &&
            props.active &&
            tween.current &&
            tween.current.paused
        ) {
            setShattered(true);
            tween.current.play();
        }
        if (shattered && !props.active) {
            setShattered(false);
        }
    }, [props.active, tween.current]);
};
