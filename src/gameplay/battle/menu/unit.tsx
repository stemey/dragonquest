import { Container } from "@dragonquest/jsx/jsx-runtime";
import { BattleActionState } from "../model/BattleActionState";
import { BattleUnit } from "../model/BattleUnit";
import { Item } from "./Item";
import { ObservableItemModel } from "./ObservableItemModel";
import { createModelProxy } from "./createModelProxy";
import { VerticalList } from "./VerticalList";

export const Unit = (props: { unit: BattleUnit }) => {
    const items = props.unit.powers.map((p, idx) => {
        const m = createModelProxy<ObservableItemModel, BattleActionState>(p, {
            text: "description",
            selected: "selected",
        });
        const textColor = m.selected ? 0xff0000 : 0xff;
        return (
            <Item
                item={m}
                config={{
                    fontSize: "13",
                    padding: { x: 23, y: 34 },
                    selectedBorderColor: 0xff000,
                    textColor,
                    width: 100,
                }}
            ></Item>
        );
    });
    return <VerticalList verticalGap={20}>{items}</VerticalList>;
};
