import { Property } from "../gameplay/worldaction/LayerObject";
import { Layer } from "./Layer";

export interface MapConfig {
    tilesets: OriginalTileset[];
    layers: Layer[];
}

export interface OriginalTileset {
    name: string;
    firstgid: number;
    tilecount: string;
    tileheight: number;
    tilewidth: number;
    image: string;
    tiles: Tile[];
}

export interface Tile {
    class: string;
    properties: Property[];
    id: number;
    objectgroup?: {
        objects: TileObject[];
    };
}

export type TileObject = TileRectangle | TilePolygon;

export interface TileRectangle {
    width: number;
    height: number;
    x: number;
    y: number;
}
export interface TilePolygon {
    polygon: { x: number; y: number }[];
}
