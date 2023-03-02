import { BattleActionState } from "../model/BattleActionState";
import { BattleUnit } from "../model/BattleUnit";
import { Item } from "./Item";
import { ObservableItemModel } from "./ObservableItemModel";
import { createModelProxy } from "./createModelProxy";
import { Potion } from "../model/Potion";
import { Div } from "../../../jsx/div/Div";
import { VerticalListV2 } from "../../../jsx/VerticalListV2";
import { Sprite } from "../../../jsx/Sprite";
import { Text } from "../../../jsx/Text";
import { Grid, GridItem } from "../../../jsx/Grid";
import { observer } from "./Observer";
import { RectangleBorder } from "../../../jsx/RectangleBorder";

export const Unit = observer(
    (props: {
        x?: number;
        y?: number;
        width?: number;
        height?: number;
        unit: BattleUnit;
    }) => {
        const items = props.unit.powers.map((p, idx) => {
            const m = createModelProxy<ObservableItemModel, BattleActionState>(
                p,
                {
                    text: "description",
                    selected: "selected",
                }
            );
            const textColor = m.selected ? 0xff0000 : 0xff;
            return (
                <Item
                    item={m}
                    config={{
                        fontSize: "8",
                        padding: { left: 0, top: 0, bottom: 0, right: 0 },
                        selectedBorderColor: 0xff000,
                        textColor,
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
                        padding: { left: 0, top: 0, bottom: 0, right: 0 },
                        selectedBorderColor: 0xff000,
                        textColor,
                    }}
                ></Item>
            );
        });
        const relative =
            (160 * (props.unit.hp.get() / props.unit.maxHp.get())) / 2;
        const columns = "60% 40%";
        const rows = "10% 30% 5% 5% 40% 10%";

        const areas = `
     title title
     hero  potion
     powerbar powerbar
     hpbar hpbar
     weapons weapons
     status status
    `;

        const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
            fontSize: "12",
            color: "0xFFFFFF",
            fixedWidth: 100,
        };

        const x = props.x || 0;
        const y = props.y || 0;

        const fillColor = props.unit.selected ? 0x3090ad : 0x005555;
       // console.log("selected", props.unit.name.get(), props.unit.selected);

        const status = props.unit.targetedBy
            .map((a) => a.battleUnit.name + ">" + a.name)
            .join(", ");

        const rectangle = new Phaser.Geom.Rectangle(
            0,
            0,
            (props.width || 120) - 4,
            (props.height || 210) - 4
        );

        const width=props.width || 120
        const height = props.height || 210

        return (
            <Div
                width={width}
                height={height}
                x={x}
                y={y}
                margin={{ left: 0, top: 0, right: 0, bottom: 0 }}
                padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
                fillColor={fillColor}
            >
                <RectangleBorder
                    width={width} height={height}
                ></RectangleBorder>
                <Grid areas={areas} columns={columns} rows={rows}>
                    <GridItem area="title">
                        <Text
                            style={{
                                fixedWidth: 160,
                                padding: { top: 0, bottom: 0 },
                                align: "center",
                                fontSize: "8",
                            }}
                            text={props.unit.name.get()}
                        />
                    </GridItem>
                    <GridItem area="hero">
                        <Sprite frame={props.unit.character.image}></Sprite>
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
                            padding={{ left: 10, top: 10, right: 0, bottom: 0 }}
                            fillColor={0x55}
                            fillAlpha={0.5}
                        >
                            <VerticalListV2>{items}</VerticalListV2>
                        </Div>
                    </GridItem>
                    <GridItem area="status">
                        <Text
                            text={status}
                            style={{ color: "red", fontSize: "8" }}
                        />
                    </GridItem>
                </Grid>
            </Div>
        );
    }
);
