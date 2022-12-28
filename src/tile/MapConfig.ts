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
}
