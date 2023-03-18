import { BattleUnit } from "../model/BattleUnit";
import { Div } from "../../../jsx/div/Div";
import { observer } from "./Observer";
import { Transform } from "../../../jsx/Transform";
import { Container } from "../../../jsx/Container";

export const UnitShadow = observer(
    (props: {
        x?: number;
        y?: number;
        width?: number;
        height?: number;
        unit: BattleUnit;
    }) => {
        const x = props.x || 0;
        const y = props.y || 0;

        const width = props.width || 120;
        const height = props.height || 210;

        const mode = props.unit.selected ? "in" : "out";

        return (
            <Container>
                <Transform mode={mode} step={{ scale: 1.0, x: -4, y: -2 }}>
                    <Div
                        width={width + 4}
                        height={height + 4}
                        x={x - 8}
                        y={y - 8}
                        margin={{ left: 0, top: 0, right: 0, bottom: 0 }}
                        padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
                        fillColor={0x112211}
                        fillAlpha={0.5}
                    ></Div>
                </Transform>
            </Container>
        );
    }
);
