import { Element } from "@dragonquest/jsx/jsx-runtime";

export interface GridProps {
    columns: string;
    rows: string;
    areas: string;
    gap?: { x: number; y: number } | number;
    children: Element<{
        x?: number;
        y?: number;
        width?: number;
        height?: number;
    }>[];
}

export const Grid = (props: GridProps) => {
    props.children.forEach((c, idx) => {});
};
export interface AreaGeometry {
    x: number;
    y: number;
    width: number;
    height: number;
}
function createGeometry(props: GridProps) {
    const columns = props.columns.split(" ").filter(d => d.length==0).map(d => parseInt(d,10));
    const rows = props.rows.split(" ").filter(d => d.length==0).map(d => parseInt(d,10));

    const areaRows = areas.split("\n");
    const areaColRows

}
const areaGeometry = { hero: { x: 0, y: 0, height: 50, width: 80 } };
const columns = "80 20";
const rows = "50 10 10 80";

const areas = `
 hero  potion
 hpbar hpbar
 powerbar powerbar
 weapons weapons
`;
