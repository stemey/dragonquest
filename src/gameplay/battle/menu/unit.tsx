import { BattleActionState } from "../model/BattleActionState";
import { BattleUnit } from "../model/BattleUnit";
import { Item } from "./Item";
import { ObservableItemModel } from "./ObservableItemModel";
import { createModelProxy } from "./createModelProxy";
import { VerticalList } from "../../../jsx/VerticalList";
import { Potion } from "../model/Potion";
import { Div } from "../../../jsx/Div";
import { HorizontalList } from "../../../jsx/HorizontalList";

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
                    padding: { left: 23, top: 34, bottom: 1, right: 0 },
                    selectedBorderColor: 0xff000,
                    textColor,
                    width: 100,
                }}
            ></Item>
        );
    });
    const potions = props.unit.potions.map((p, idx) => {
        const m = createModelProxy<ObservableItemModel, Potion>(p, {
            text: (p: Potion) => p.name + " (" + p.count + ")",
            selected: "selected",
        });
        const textColor = m.selected ? 0xff0000 : 0xff;
        return (
            <Item
                item={m}
                config={{
                    fontSize: "13",
                    padding: { left: 23, top: 34, bottom: 1, right: 0 },
                    selectedBorderColor: 0xff000,
                    textColor,
                    width: 100,
                }}
            ></Item>
        );
    });
    return (
        <VerticalList verticalGap={20}>
            <Div
                width={400}
                margin={{ left: 10, top: 10, right: 10, bottom: 10 }}
                padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
                fillColor={0x55}
                fillAlpha={0.5}
            >
                <VerticalList verticalGap={20}>{items}</VerticalList>
            </Div>
            <Div
                width={300}
                margin={{ left: 10, top: 10, right: 10, bottom: 10 }}
                padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
                fillColor={0x550000}
                fillAlpha={0.5}
            >
                <HorizontalList gap={20}>{potions}</HorizontalList>
            </Div>

            <Div
                width={300}
                height={10}
                margin={{ left: 0, top: 0, right: 0, bottom: 0 }}
                padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
                fillColor={0x5500}
                fillAlpha={0.5}
            ></Div>
        </VerticalList>
    );
};
