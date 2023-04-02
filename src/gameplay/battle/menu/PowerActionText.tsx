import { useEffect, useRef } from "@dragonquest/jsx/jsx-runtime";
import { GameObjects, Tweens } from "phaser";
import { Text } from "../../../jsx/Text";
import { BattleUnit } from "../model/BattleUnit";
import { observer } from "./Observer";

export interface ActionTextProps {
    unit: BattleUnit;
    x?: number;
    y?: number;
}

export const PowerActionText = observer((props: ActionTextProps) => {
    const { x, y } = props;
    const ref = useRef<GameObjects.Text>();

    const power = props.unit.currentlyChosenPower;
    const text = power?.name || "";

    const style = {
        align: "center",
        color: "blue",
        fontSize: "20px",
        strokeThickness: 5,
    };

    useEffect(() => {
        let tween: Tweens.Tween | undefined = undefined;
        if (ref.current && power) {
            const config = {
                targets: ref.current,
                alpha: 1,
                scale: 1.5,
                y: -40,
                ease: "Power1",
                duration: 500,
            } as any;

            tween = ref.current.scene.tweens.add(config);
        }

        return () => {
            if (tween) {
                tween.remove();
            }
        };
    }, [power, props.unit, ref.current]);

    return <Text alpha={0} ref={ref} x={x} y={y} style={style} text={text} />;
});
