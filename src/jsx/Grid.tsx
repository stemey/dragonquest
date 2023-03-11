import { Element } from "@dragonquest/jsx/jsx-runtime";
import { Container } from "./Container";
import { createGeometry } from "./createGeometry";
import { GridProps } from "./GridProps";

export interface GridItemProps {
    area: string;
    children?: Element<any>[];
    x?: number;
    y?: number;
    height?: number;
    width?: number;
    key?:string;
}

export const GridItem = (props: GridItemProps) => {
    if (!props.children || props.children.length<0) {
        return
    }
    const child = props.children[0];
    if (!child.props) {
        child.props = {};
    }
    child.props.x = -(props.width || 0)/2
    child.props.y = -(props.height || 0)/2
    child.props.height = props.height;
    child.props.width = props.width;

    const x = (props.x||0) + (props.width || 0)/2
    const y = (props.y||0) + (props.height || 0)/2
    
    // container to be able to scale children
    return <Container name={props.area} x={x} y={y}>{child}</Container>;
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
    return <Container name={props.name}>{children}</Container>;
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
