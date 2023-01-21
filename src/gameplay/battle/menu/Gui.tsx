import { Element } from "@dragonquest/jsx/src/Element";
import { Container } from "../../../jsx/Container";
import { BattleUnit } from "../model/BattleUnit";
import { Unit } from "./Unit";

export function Gui(props: { units: BattleUnit[] }):Element<any> {
    const units = props.units.map((u) => {
        return <Unit unit={u}></Unit>;
    });
    return (
        <Container x={100} y={0}>
            {units}
        </Container>
    );
}
