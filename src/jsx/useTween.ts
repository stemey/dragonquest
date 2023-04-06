import { Ref, useEffect, useRef } from "@dragonquest/jsx/jsx-runtime";
import { GameObjects, Tweens } from "phaser";

export interface AdditionalConfigProps {
    x: number;
    y: number;
}
export interface TransformProps {
    objectRef: Ref<GameObjects.GameObject>;
    config:
        | Partial<Phaser.Types.Tweens.TweenBuilderConfig>
        | Partial<Phaser.Types.Tweens.TweenBuilderConfig>[];
}
export const useTween = (props: TransformProps) => {
    const tweenRef = useRef<Tweens.Tween | Tweens.Timeline | undefined>();
    const { objectRef, config } = props;

    useEffect(() => {
        if (objectRef.current) {
            if (Array.isArray(config)) {
                tweenRef.current = objectRef.current.scene.tweens.timeline({
                    targets: [objectRef.current],
                    paused: true,
                    tweens: config,
                });
            } else {
                tweenRef.current = objectRef.current.scene.tweens.add({
                    ...config,
                    targets: [objectRef.current],
                });
            }
        }

        return () => {
            if (tweenRef.current) {
                if (tweenRef.current instanceof Tweens.Timeline) {
                    tweenRef.current.destroy();
                } else {
                    tweenRef.current.remove();
                }
            }
        };
    }, [objectRef?.current, config]);
    return tweenRef;
};
