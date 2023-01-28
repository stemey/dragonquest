import { Element } from "@dragonquest/jsx/jsx-runtime";


export interface GridProps {
    columns: string;
    rows: string;
    areas: string;
    gap?: { x: number; y: number; } | number;
    x?:number;
    y?:number;
    children?: Element<{
        x?: number;
        y?: number;
        area: string;
        width?: number;
        height?: number;
    }>[];
}
