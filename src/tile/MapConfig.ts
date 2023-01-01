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
    image:string;
    tiles: Tile[]
}

export type Tile  = TileConfig | ObjectGroupConfig;
export interface TileConfig {
    class:string;
    properties:Property[];
    id:number;
}
export interface ObjectGroupConfig {
    objectgroup:any

}