import { BattleActionState } from "../model/BattleActionState";
import { BattleUnit } from "../model/BattleUnit";
import { Item } from "./Item";
import { ObservableItemModel } from "./ObservableItemModel";
import { createModelProxy } from "./createModelProxy";
import { Potion } from "../model/Potion";
import { Div } from "../../../jsx/Div";
import { VerticalListV2 } from "../../../jsx/VerticalListV2";
import { Sprite } from "../../../jsx/Sprite";
import { HorizontalListV2 } from "../../../jsx/HorizontalListV2";
import { Text } from "../../../jsx/Text";
import { Grid, GridItem } from "../../../jsx/Grid";

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
                    fontSize: "8",
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
                    fontSize: "8",
                    padding: { left: 23, top: 34, bottom: 1, right: 0 },
                    selectedBorderColor: 0xff000,
                    textColor,
                    width: 100,
                }}
            ></Item>
        );
    });
    const relative = (160 * (props.unit.hp.get() / props.unit.maxHp.get())) / 2;
    const columns = "80 20";
    const rows = "20 50 10 10 100";

    const areas = `
     title title
     hero  potion
     powerbar powerbar
     hpbar hpbar
     weapons weapons
    `;

    const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
        fontSize: "12",
        color: "0xFFFFFF",
        fixedWidth: 100,
    };

    return (
        <Div
            width={120}
            height={210}
            x={50}
            y={20}
            margin={{ left: 0, top: 0, right: 0, bottom: 0 }}
            padding={{ left: 20, top: 20, right: 0, bottom: 0 }}
            fillColor={0x3090ad}
        >
            <Grid areas={areas} columns={columns} rows={rows}>
                <GridItem area="title">
                    <Text
                        style={{
                            fixedWidth: 160,
                            padding: { top: 0, bottom: 0 },
                            align: "center",
                        }}
                        text={props.unit.name.get()}
                    />
                </GridItem>
                <GridItem area="hero">
                    <Sprite frame="knight"></Sprite>
                </GridItem>

                <GridItem area="potion">
                    <VerticalListV2>{potions}</VerticalListV2>
                </GridItem>
                <GridItem area="hpbar">
                    <Div
                        margin={{ left: 0, top: 0, right: 0, bottom: 0 }}
                        padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
                        fillColor={0x005500}
                        fillAlpha={0.5}

                    ></Div>
                </GridItem>
                <GridItem area="powerbar">
                    <Div
                        margin={{ left: 0, top: 0, right: 0, bottom: 0 }}
                        padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
                        fillColor={0x550000}
                        fillAlpha={0.5}

                    ></Div>
                </GridItem>
                <GridItem area="weapons">
                    <Div
                        margin={{ left: 0, top: 0, right: 0, bottom: 0 }}
                        padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
                        fillColor={0x55}
                        fillAlpha={0.5}
                    >
                        <VerticalListV2>{items}</VerticalListV2>
                    </Div>
                </GridItem>
            </Grid>
        </Div>
    );
};
/*
<VerticalListV2>
<Text
    style={{
        fixedWidth: 160,
        padding: { top: 5, bottom: 5 },
        align: "center",
    }}
    text={props.unit.name.get()}
/>
<HorizontalListV2>
    <Sprite scaleX={2} frame="knight"></Sprite>
    <Div
        width={60}
        margin={{ left: 10, top: 10, right: 10, bottom: 10 }}
        padding={{ left: 10, top: 10, right: 10, bottom: 0 }}
        fillColor={0x55}
        fillAlpha={0.5}
    >
        <VerticalListV2>{potions}</VerticalListV2>
    </Div>
</HorizontalListV2>
<Div
    width={160 - relative}
    height={0}
    margin={{
        left: 10,
        top: 10,
        right: relative + 10,
        bottom: 10,
    }}
    padding={{ left: 10, top: 5, right: 10, bottom: 0 }}
    fillColor={0x005500}
></Div>
<Div
    width={160 - relative}
    height={0}
    margin={{
        left: 10,
        top: 10,
        right: relative + 10,
        bottom: 10,
    }}
    padding={{ left: 10, top: 5, right: 10, bottom: 0 }}
    fillColor={0x550000}
></Div>

<Div
    width={160}
    margin={{ left: 10, top: 10, right: 10, bottom: 10 }}
    padding={{ left: 10, top: 10, right: 10, bottom: 0 }}
    fillColor={0x55}
    fillAlpha={0.5}
>
    <VerticalListV2>{items}</VerticalListV2>
</Div>
</VerticalListV2>
*/
