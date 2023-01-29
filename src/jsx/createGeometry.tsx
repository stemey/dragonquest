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
    const height = props.height;
    const width = props.width;
    const columns = props.columns
        .split(" ")
        .filter((d) => d.length !== 0)
        .map((d) => parseSize(d, width));
    const rows = props.rows
        .split(" ")
        .filter((d) => d.length !== 0)
        .map((d) => parseSize(d, height));

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
        const x = getValue(columns, areaRowCol.colStart - 1);
        const width =
            getValue(columns, areaRowCol.colEnd || areaRowCol.colStart) - x;
        const y = getValue(rows, areaRowCol.rowStart - 1);
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
function parseSize(d: string, maxSize?: number): number {
    const match = d.match(/.*%$/);
    if (match) {
        const percentage = parseInt(d.substring(0, d.length - 1), 10);
        if (!maxSize) {
            console.error("no maxSize givem, so cannot derive percentage");
            return 1;
        }
        return (percentage / 100) * maxSize;
    } else {
        return parseInt(d, 10);
    }
}
