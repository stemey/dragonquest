import { BattleUnit } from "../model/BattleUnit";
import { Unit } from "./unit";

function Ui(props: { units: BattleUnit[] }) {
    const units = props.units.map((u) => {
        return <Unit unit={u}></Unit>;
    });
    return units;
}
