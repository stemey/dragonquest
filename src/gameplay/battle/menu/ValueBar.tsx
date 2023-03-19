import { Div } from "../../../jsx/div/Div";
import { Grid, GridItem } from "../../../jsx/Grid";

export interface ValueBarProps {
    value: number;
    maxValue: number;
    emptyColor: number;
    fillColor: number;
    x?: number;
    y?: number;
    height?: number;
    width?: number;
}

export const ValueBar = (props: ValueBarProps) => {
    const { value, maxValue, emptyColor, fillColor } = props;

    const valuePercentage = Math.trunc((value * 100) / maxValue);
    const columns = `${valuePercentage} ${100 - valuePercentage}`;
    const rows = "100%";

    return (
        <Grid
            areas="value empty"
            columns={columns}
            rows={rows}
            height={props.height}
            width={props.height}
            x={props.x}
            y={props.y}
        >
            <GridItem area="value">
                <Div fillColor={fillColor}></Div>
            </GridItem>
            <GridItem area="empty">
                <Div fillColor={emptyColor}></Div>
            </GridItem>
        </Grid>
    );
};
