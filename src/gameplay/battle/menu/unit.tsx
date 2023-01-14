import { BattleUnit } from "../model/BattleUnit";

export const Unit = (props: { unit: BattleUnit }) => {
    return props.unit.name;
};
