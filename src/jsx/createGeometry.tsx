import { GridProps } from "./GridProps";

export interface AreaGeometry {
    x: number;
    y: number;
    width: number;
    height: number;
}

export function getValue(values: number[], idx: number, gap: number = 0) {
    if (idx < 0) {
        return 0;
    }
    return values
        .filter((value, x) => x <= idx)
        .reduce((val, value) => {
            val += value;
            return val;
        }, 0);
}

export function createGeometry(props: GridProps) {
    const { height, width } = props;
    const gap = getGap(props.gap);
    const columns = props.columns
        .split(" ")
        .filter((d) => d.length !== 0)
        .map((d) =>
            parseSize(
                d,
                width ? width - props.columns.length * gap.x : props.columns
            )
        );
    const rows = props.rows
        .split(" ")
        .filter((d) => d.length !== 0)
        .map((d) =>
            parseSize(
                d,
                height ? height - props.rows.length * gap.y : props.rows
            )
        );

    const areaRows = props.areas
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
    const areasRowCol: {
        [name: string]: {
            rowStart: number;
            colStart: number;
            rowEnd?: number;
            colEnd?: number;
        };
    } = {};
    areaRows.forEach((row, rowIdx) => {
        const cells = row.split(" ").filter((d) => d.length !== 0);
        cells.forEach((c, colIdx) => {
            if (c === ".") {
                return;
            }
            const area = areasRowCol[c];
            if (!area) {
                areasRowCol[c] = { colStart: colIdx, rowStart: rowIdx };
            } else {
                const colEnd = Math.max(area.colEnd || 0, colIdx);
                area.colEnd = colEnd;
                const rowEnd = Math.max(area.rowEnd || 0, rowIdx);
                area.rowEnd = rowEnd;
            }
        });
    });
    const areas: {
        [name: string]: AreaGeometry;
    } = {};
    Object.keys(areasRowCol).forEach((name) => {
        const areaRowCol = areasRowCol[name];
        const x = getValue(columns, areaRowCol.colStart - 1) + gap.x;
        const width =
            getValue(columns, areaRowCol.colEnd || areaRowCol.colStart) - x;
        const y = getValue(rows, areaRowCol.rowStart - 1) + gap.y;
        const height =
            getValue(rows, areaRowCol.rowEnd || areaRowCol.rowStart) - y;
        areas[name] = {
            x,
            y,
            width,
            height,
        };
    });
    return areas;
}
function parseSize(d: string, maxSize: number | string): number {
    const match = d.match(/.*%$/);
    if (match) {
        const percentage = parseInt(d.substring(0, d.length - 1), 10);
        if (typeof maxSize === "string") {
            console.error(
                "no maxSize given, so cannot derive percentage",
                maxSize
            );
            return 1;
        }
        return (percentage / 100) * maxSize;
    } else {
        return parseInt(d, 10);
    }
}
function getGap(gap: number | { x: number; y: number } | undefined) {
    if (!gap) {
        return { x: 0, y: 0 };
    } else if (typeof gap == "number") {
        return { x: gap, y: gap };
    } else {
        return { x: gap.x, y: gap.y };
    }
}
