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
import { Border1 } from "../../../card/border/Border1";
import { getColor } from "../../../utils/color";
import { Container } from "../../../jsx/Container";
import { RectangleBorderV2 } from "../../../jsx/RectangleBorderV2";
import { ValueBar } from "./ValueBar";
import { HpActionText } from "./HpActionText";
import { UnitTransform } from "./UnitTransform";
import { PowerActionText } from "./PowerActionText";

export const Unit = observer(
    (props: {
        x?: number;
        y?: number;
        width?: number;
        height?: number;
        unit: BattleUnit;
        baseColor: number;
        candidate?: boolean;
    }) => {
        const { baseColor } = props;
        const preparePhase = props.unit.battleModel.prepare.get();
        const satFactor =
            preparePhase || props.unit.battleMode.get() !== "" ? 1 : 0;
        const fillColor =
            props.unit.selected || props.unit.battleMode.get() !== ""
                ? getColor(baseColor, 0.3, 0.2 * satFactor, 0.6)
                : getColor(baseColor, 0.3, 0.2 * satFactor, 0.5);
        const borderLineColor = getColor(baseColor, 0, 0.4 * satFactor, 0.8);
        const borderFillColor = getColor(baseColor, 0.3, 0.3 * satFactor, 0.4);
        const textColor = getColor(baseColor, 0, 0.2 * satFactor, 1);

        const items = props.unit.powers.map((p, idx) => {
            const m = createModelProxy<ObservableItemModel, BattleActionState>(
                p,
                {
                    text: "description",
                    selected: "selected",
                }
            );
            const textColor1 = m.selected ? textColor : textColor;
            return (
                <Item
                    key={m.text}
                    item={m}
                    config={{
                        fontSize: "8",
                        padding: { left: 0, top: 0, bottom: 0, right: 0 },
                        selectedBorderColor: textColor,
                        textColor: textColor1,
                    }}
                ></Item>
            );
        });
        const potions = props.unit.potions.map((p, idx) => {
            const m = createModelProxy<ObservableItemModel, Potion>(p, {
                text: (p: Potion) => p.name + " (" + p.count + ")",
                selected: "selected",
            });
            const textColor1 = m.selected ? textColor : textColor;
            return (
                <Item
                    key={m.text}
                    item={m}
                    config={{
                        fontSize: "8",
                        padding: { left: 0, top: 0, bottom: 0, right: 0 },
                        selectedBorderColor: textColor1,
                        textColor: textColor1,
                    }}
                ></Item>
            );
        });
        const columns = "60% 40%";
        const rows = "10% 30% 7% 7% 36% 10%";

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

        const status = props.unit.targetedBy
            .map((a) => a.battleUnit.name + ">" + a.name)
            .join(", ");

        const rectangle = new Phaser.Geom.Rectangle(
            0,
            0,
            (props.width || 120) - 4,
            (props.height || 210) - 4
        );

        const width = props.width || 120;
        const height = props.height || 210;

        const candidate = !!props.candidate;

        return (
            <Container name={props.unit.name.get()}>
                <UnitTransform unit={props.unit}>
                    <RectangleBorderV2
                        visible={candidate}
                        height={height}
                        width={width}
                    ></RectangleBorderV2>

                    <Div
                        width={width}
                        height={height}
                        x={x}
                        y={y}
                        margin={{ left: 0, top: 0, right: 0, bottom: 0 }}
                        padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
                        fillColor={borderFillColor}
                        onPointerDown={() => {
                            if (
                                candidate &&
                                props.unit.battleModel.weaponSelected
                            ) {
                                props.unit.battleModel.currentHero.selectTarget(
                                    props.unit
                                );
                            } else {
                                props.unit.toggle();
                            }
                        }}
                    >
                        <Border1
                            lineColor={borderLineColor}
                            fillColor={fillColor}
                            width={width}
                            height={height}
                            options={{ indent: 4 }}
                        />
                        <Grid areas={areas} columns={columns} rows={rows}>
                            <GridItem area="title">
                                <Text
                                    style={{
                                        fixedWidth: 160,
                                        padding: { top: 0, bottom: 0 },
                                        align: "center",
                                        fontSize: "8",
                                        color: "#" + textColor.toString(16),
                                    }}
                                    text={props.unit.name.get()}
                                />
                            </GridItem>
                            <GridItem area="hero">
                                <Div>
                                    <Sprite
                                        frame={props.unit.character.image}
                                    ></Sprite>
                                </Div>
                            </GridItem>

                            <GridItem area="potion">
                                <VerticalListV2>{potions}</VerticalListV2>
                            </GridItem>

                            <GridItem area="hpbar">
                                <ValueBar
                                    emptyColor={0x003300}
                                    fillColor={0x00dd00}
                                    value={props.unit.hp.get()}
                                    maxValue={props.unit.maxHp.get()}
                                ></ValueBar>
                            </GridItem>
                            <GridItem area="powerbar">
                                <ValueBar
                                    emptyColor={0x330000}
                                    fillColor={0xdd0000}
                                    value={10}
                                    maxValue={100}
                                ></ValueBar>
                            </GridItem>
                            <GridItem area="weapons">
                                <Div
                                    margin={{
                                        left: 0,
                                        top: 0,
                                        right: 0,
                                        bottom: 0,
                                    }}
                                    padding={{
                                        left: 10,
                                        top: 10,
                                        right: 0,
                                        bottom: 0,
                                    }}
                                    fillColor={0xffffff}
                                    fillAlpha={0.1}
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
                </UnitTransform>
                <HpActionText
                    x={-(props.width || 0) / 2}
                    y={0}
                    unit={props.unit}
                ></HpActionText>
                <PowerActionText
                    x={-(props.width || 0) / 2}
                    y={0}
                    unit={props.unit}
                ></PowerActionText>
            </Container>
        );
    }
);
