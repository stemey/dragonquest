import { Container } from "@dragonquest/jsx/jsx-runtime";
import { Element } from "@dragonquest/jsx/src/Element";
import { BattleUnit } from "../model/BattleUnit";
import { Unit } from "./Unit";

export function Gui(props: { units: BattleUnit[] }):Element<any> {
    const units = props.units.map((u) => {
        return <Unit unit={u}></Unit>;
    });
    return (
        <Container x={0} y={0}>
            {units}
        </Container>
    );
}
