import { useEffect, useRef } from "@dragonquest/jsx/jsx-runtime";
import { GameObjects, Tweens } from "phaser";
import { Text } from "../../../jsx/Text";
import { BattleUnit } from "../model/BattleUnit";
import { AnimationTiming } from "./AnimationTiming";
import { observer } from "./Observer";

export interface ActionTextProps {
    unit: BattleUnit;
    x?: number;
    y?: number;
}

export const HpActionText = observer((props: ActionTextProps) => {
    const { x, y } = props;
    const ref = useRef<GameObjects.Text>();
    const currentHp = useRef(props.unit.hp.get() || 0);
    const deltaHp =
        props.unit.hp.get() - (currentHp.current || props.unit.maxHp.get());
    const defend = props.unit.battleMode.get() === "defend";
    const text = deltaHp !== 0 ? deltaHp + "HP" : "Defended";
    const alpha = 0;

    const style = {
        align: "center",
        color: deltaHp < 0 ? "red" : "green",
        fontSize: "20px",
        strokeThickness: 5,
    };

    useEffect(() => {
        let tween: Tweens.Tween | undefined = undefined;
        if (defend && ref.current) {
            const config = {
                targets: ref.current,
                alpha: 1,
                scale: 1.5,
                y: -40,
                ease: "Power1",
                delay: AnimationTiming.defenseDelay,
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
    }, [deltaHp, defend]);

    return (
        <Text alpha={alpha} ref={ref} x={x} y={y} style={style} text={text} />
    );
});
