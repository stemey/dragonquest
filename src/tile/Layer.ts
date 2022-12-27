import {  Property } from "../gameplay/worldaction/LayerObject";

export type Layer = Group | TileLayer | ObjectLayer;
export interface BaseLayer {
    type: "tilelayer" | "objectgroup" | "group";
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    properties: Property[];
}



export interface TileLayer extends BaseLayer {
    type: "tilelayer";
    data: number[];
    tileset:string;
}

export interface Object extends BaseLayer {
    class: string;
}

export interface ObjectLayer extends BaseLayer {
    type: "objectgroup";
    objects: Object[];
}

export interface Group{
    type: "group";
    layers: Layer[];
    properties: Property[];
}
