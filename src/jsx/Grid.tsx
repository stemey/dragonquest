import { Element } from "@dragonquest/jsx/jsx-runtime";
import { Container } from "./Container";
import { createGeometry } from "./createGeometry";
import { GridProps } from "./GridProps";

export interface GridItemProps {
    area: string;
    children?: Element<any>;
    x?: number;
    y?: number;
    height?: number;
    width?: number;
}

export const GridItem = (props: GridItemProps) => {
    const child = { ...props.children };
    if (!child.props) {
        child.props = {};
    }
    child.props.x = props.x;
    child.props.y = props.y;
    child.props.height = props.height;
    child.props.width = props.width;
    console.log(
        "grid",
        props.area,
        props.x,
        props.y,
        props.width,
        props.height
    );
    return child;
};

export const Grid = (props: GridProps) => {
    const geom = createGeometry(props);
    const children = props.children || [];
    const x = props.x || 0;
    const y = props.y || 0;
    children.forEach((c, idx) => {
        if (c.props.area && geom[c.props.area]) {
            const areaGeom = geom[c.props.area];
            c.props.x = x + areaGeom.x;
            c.props.y = y + areaGeom.y;
            c.props.width = areaGeom.width;
            c.props.height = areaGeom.height;
        }
    });
    // just return children without container
    return <Container>{children}</Container>;
};

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
