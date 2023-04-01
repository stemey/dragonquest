import { useRef } from "@dragonquest/jsx/jsx-runtime";
import { GameObjects } from "phaser";
import { Container } from "../../../jsx/Container";
import { Transform } from "../../../jsx/Transform";
import { BattleUnit } from "../model/BattleUnit";
import { observer } from "./Observer";
import { useShatter } from "./useShatter";

export const UnitTransform = observer(
    (props: { unit: BattleUnit; children?: Element[] }) => {
        const shatterRef = useRef<GameObjects.GameObject>();
        const battleMode = props.unit.battleMode.get();
        const mode = props.unit.selected || battleMode !== "" ? "in" : "out";

        useShatter({
            objectRef: shatterRef,
            active: battleMode == "defend",
        });

        return (
            <Container name="unitTransform" ref={shatterRef}>
                <Transform
                    mode={mode}
                    step={{ scale: 1.05, x: 10, y: 4 }}
                    delay={battleMode == "defend" ? 300 : 0}
                >
                    {props.children}
                </Transform>
            </Container>
        );
    }
);
/*
 <ShatterTransform
                objectRef={shatterRef}
                active={props.unit.battleMode.get() == "defend"}
            >
                <Container name="shatter" x={0} y={0} ref={shatterRef}>
                    
                </Container>
            </ShatterTransform>
            */
