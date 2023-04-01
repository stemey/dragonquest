import { Ref, useEffect, useRef } from "@dragonquest/jsx/jsx-runtime";
import { GameObjects, Tweens } from "phaser";

export interface TransformProps {
    objectRef: Ref<GameObjects.GameObject>;
    config: Partial<Phaser.Types.Tweens.TweenBuilderConfig>;
}
export const useTween = (props: TransformProps & any) => {
    const tweenRef = useRef<Tweens.Tween | undefined>();
    const { objectRef, config } = props;

    useEffect(() => {
        let tween: Tweens.Tween | undefined = undefined;
        if (objectRef.current) {
            tweenRef.current = objectRef.current.scene.tweens.add({
                ...config,
                targets: [objectRef.current],
            });
        }

        return () => {
            if (tween) {
                tween.remove();
            }
        };
    }, [objectRef?.current, config]);
    return tweenRef;
};
