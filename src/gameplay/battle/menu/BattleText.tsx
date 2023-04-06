import { useEffect, useRef } from "@dragonquest/jsx/jsx-runtime";
import { GameObjects, Tweens } from "phaser";
import { Text } from "../../../jsx/Text";
import { BattleUnit } from "../model/BattleUnit";
import { observer } from "./Observer";
import { BattleModel } from "../model/BattleModel";
import { dimension } from "../../../config";

export interface BattleTextProps {
    battle: BattleModel;
    x?: number;
    y?: number;
}

export const BattleText = observer((props: BattleTextProps) => {
    const { x = 0, y = 0 } = props;
    const ref = useRef<GameObjects.Text>();

    const phase = props.battle.prepare.get();
    const win = props.battle.win;

    const style = {
        align: "left",

        color: win ? "blue" : "red",
        fontSize: "40px",
        strokeThickness: 8,
    };
    const text = win ? "Victory" : "Defeat";

    useEffect(() => {
        let tween: Tweens.Tween | undefined = undefined;
        if (ref.current && phase == "finished") {
            const config = {
                targets: ref.current,
                alpha: 1,
                scale: 1.5,
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
    }, [phase, win, ref.current]);

    return (
        <Text
            alpha={0}
            ref={ref}
            x={x + dimension.width / 2 - 80}
            y={y + dimension.height / 2 - 40}
            style={style}
            text={text}
        />
    );
});
