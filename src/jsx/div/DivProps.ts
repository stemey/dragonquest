import { Element } from "@dragonquest/jsx/src/Element";
import { Padding } from "../../gameplay/battle/menu/Padding";


export interface DivProps {
    area?: string;
    margin: Padding;
    padding: Padding;
    width?: number;
    height?: number;
    fillColor?: number;
    fillAlpha?: number;
    x?: number;
    y?: number;
    children?:Element<any>[]
}
