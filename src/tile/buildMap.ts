import { Scene } from "phaser";
import { getProp, LayerObject } from "../gameplay/worldaction/LayerObject";
import { Layer, TileLayer } from "./Layer";
import { OriginalTileset, TileConfig } from "./MapConfig";

export const buildMap = (
    scene: Scene,
    x0: number,
    y0: number,
    layer: TileLayer,
    tileset: OriginalTileset
) => {
    //  Parse the data out of the map

    const tilewidth = tileset.tilewidth;
    const tileheight = tileset.tileheight;

    const mapwidth = layer.width;
    const mapheight = layer.height;

    let i = 0;

    for (let y = 0; y < mapheight; y++) {
        for (let x = 0; x < mapwidth; x++) {
            const id = layer.data[i] - 1;

            const tx = (x + 0.5) * tilewidth;
            const ty = (y + 0.5) * tileheight;

            if (id > 0) {
                const gid = id - tileset.firstgid + 1;
                const tile = scene.add.image(
                    x0 + tx,
                    y0 + ty,
                    tileset.image.substring(
                        0,
                        tileset.image.length - ".png".length
                    ),
                    gid
                );
                const height = tileset.tiles.reduce((h, t) => {
                    if ("class" in t && t.id === gid) {
                        const height = getProp("height", t.properties) as number;
                        return height || 0;
                    }
                    return h;
                }, 0);
                tile.depth = y + height;
            }

            i++;
        }
    }
};
