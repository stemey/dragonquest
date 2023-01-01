import { Scene } from "phaser";
import { getProp, LayerObject } from "../gameplay/worldaction/LayerObject";
import { AbstractWorld } from "../scenes/AbstractWorld";
import { Layer, TileLayer } from "./Layer";
import { OriginalTileset } from "./MapConfig";

export const buildMap = (
    scene: AbstractWorld,
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
    var statics = scene.physics.add.staticGroup();
    if (scene.player) {
        scene.physics.add.collider(scene.player, statics);

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

                    const tileConfig = tileset.tiles.find((t) => t.id === gid);

                    let height = 0;
                    if (tileConfig) {
                        if ("class" in tileConfig) {
                            const heightProp = getProp(
                                "height",
                                tileConfig.properties
                            ) as number;
                            height = heightProp || 0;
                        }
                    }
                    if (tileConfig?.objectgroup?.objects) {
                        tileConfig.objectgroup.objects.forEach((p) => {
                            if ("polygon" in p) {
                                const polyonCoords = p.polygon
                                    .map((c) => c.x + " " + c.y)
                                    .join(" ");
                                const poly = new Phaser.GameObjects.Polygon(
                                    scene,
                                    tx,
                                    ty,
                                    polyonCoords,
                                    0x0000ff
                                );

                                statics.add(poly);
                            } else if ("width" in p) {
                                const poly = new Phaser.GameObjects.Rectangle(
                                    scene,
                                    Math.round(
                                        x0 +
                                            tx -
                                            tilewidth / 2 +
                                            p.x +
                                            p.width / 2
                                    ),
                                    Math.round(
                                        y0 +
                                            ty -
                                            tileheight / 2 +
                                            p.y +
                                            p.height / 2
                                    ),
                                    Math.round(p.width),
                                    Math.round(p.height),
                                    123
                                );
                                //scene.add.existing(poly);
                                poly.visible = false;

                                 statics.add(poly, true);
                            }
                        });
                    }

                    tile.depth = y + height;
                }

                i++;
            }
        }
    }
};
