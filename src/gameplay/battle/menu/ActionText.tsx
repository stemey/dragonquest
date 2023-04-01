import { useEffect, useRef } from "@dragonquest/jsx/jsx-runtime";
import { GameObjects, Tweens } from "phaser";
import { Text } from "../../../jsx/Text";
import { BattleUnit } from "../model/BattleUnit";

export interface ActionTextProps {
    unit: BattleUnit;
    x?: number;
    y?: number;
    style: Phaser.Types.GameObjects.Text.TextStyle;
}

export const ActionText = (props: ActionTextProps) => {
    const { x, y, style } = props;
    const ref = useRef<GameObjects.Text>();
    const currentHp = useRef(props.unit.hp.get() || 0);
    const deltaHp =
        (currentHp.current || props.unit.maxHp.get()) - props.unit.hp.get();
    const text = "-" + deltaHp + "HP";
    const alpha = 0;

    useEffect(() => {
        let tween: Tweens.Tween | undefined = undefined;
        if (ref.current && deltaHp > 0) {
            const config = {
                targets: ref.current,
                alpha: 1,
                scale:1.5,
                y:-40,
                ease: "Power1",
                duration: 500,
                onComplete: () => {
                    currentHp.current = props.unit.hp.get();
                },
            } as any;

            tween = ref.current.scene.tweens.add(config);
        }

        return () => {
            if (tween) {
                tween.remove();
            }
        };
    }, [deltaHp]);
   
    return (
        <Text alpha={alpha} ref={ref} x={x} y={y} style={style} text={text} />
    );
};
