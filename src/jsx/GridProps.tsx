import { Element } from "@dragonquest/jsx/jsx-runtime";


export interface GridProps {
    columns: string;
    name?:string;
    rows: string;
    areas: string;
    gap?: { x: number; y: number; } | number;
    x?:number;
    y?:number;
    width?:number;
    height?:number;
    children?: Element<{
        x?: number;
        y?: number;
        area: string;
        width?: number;
        height?: number;
    }>[];
}
