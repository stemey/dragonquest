import { Action } from "../gameplay/worldaction/Action";
import { LayerObject } from "../gameplay/worldaction/LayerObject";
import * as Phaser from "phaser";
import { MapConfig, OriginalTileset } from "./MapConfig";
import { Layer } from "./Layer";
import { AbstractWorld } from "../scenes/AbstractWorld";
import { LayerAction } from "../gameplay/worldaction/LayerAction";
import { buildMap } from "./buildMap";

interface Tileset {
    name: string;
    first: number;
    count: number;
    original: OriginalTileset;
}

export default class TileLayerFactory {
    tileSetImages: { [key: string]: Phaser.Tilemaps.Tileset } = {};
    mapConfig: MapConfig;
    tileSets: Tileset[];
    actions: { [name: string]: Action<any> } = {};
    layerActions: { [name: string]: LayerAction } = {};

    constructor(
        private readonly mapKey: string,
        private readonly scene: AbstractWorld
    ) {
        let data = scene.cache.tilemap.get(mapKey);
        if (!data) {
            const dataFromJson = scene.cache.json.get(mapKey);
            const tilesets = dataFromJson.tilesets.map((ts: any) => {
                const match = ts.source.match(/([a-zA-Z_0-9]+)\.(tsx|json)/);
                const name = match[1];
                return {
                    firstgid: ts.firstgid,
                    ...scene.cache.json.get("tiled_meta_" + name.toLowerCase()),
                };
            });
            data = { data: { ...dataFromJson, tilesets } };
        }
        this.mapConfig = data.data;
        this.tileSets = this.mapConfig.tilesets.map((tileset) => {
            return {
                name: tileset.name,
                first: tileset.firstgid,
                count: parseInt(tileset.tilecount, 10),
                original: tileset,
            };
        });
        this.scene.cache.tilemap.add(this.mapKey, {
            data: this.mapConfig,
            format: 1,
        });
        this.checkTilesets(this.mapConfig.layers);
    }

    checkTilesets(layers: Layer[], path?: string) {
        layers.forEach((layer) => {
            if (layer.type === "tilelayer") {
                let tileSets: Tileset[] = this.findTilesetList(layer.data);
                const uniqueTileSet: { [name: string]: Tileset } = {};
                tileSets.forEach((ts) => {
                    if (ts) {
                        uniqueTileSet[ts.name] = ts;
                    }
                });
                tileSets = Object.values(uniqueTileSet);
                if (tileSets.length === 0) {
                    console.warn(`no tileset found for layer ${layer.name}`);
                } else if (tileSets.length > 1) {
                    console.warn(
                        `more than one tileset found for layer ${
                            layer.name
                        } ${tileSets.map((t) => t.name).join(", ")}`
                    );
                } else {
                    layer.tileset = tileSets[0].name;
                    layer.path = path ? path + "/" + layer.name : layer.name;
                }
            } else if (layer.type === "group") {
                const childPath = path ? path + "/" + layer.name : layer.name;
                this.checkTilesets(layer.layers, childPath);
            }
        });
    }

    findTileset(gid: number) {
        let tileSets = this.tileSets.filter((tileSet) => {
            return tileSet.first <= gid && tileSet.first + tileSet.count > gid;
        });
        if (tileSets.length === 1) {
            return tileSets[0];
        }
        return null;
    }

    findTilesetList(gids: number[]): Tileset[] {
        if (!gids) {
            return [];
        }
        return gids
            .map((gid) => this.findTileset(gid))
            .filter((tileSet) => !!tileSet) as Tileset[];
    }

    boot() {
        this.tileSets.forEach((ts) => {
            this.scene.load.image(ts.name, "assets/map/" + ts.name + ".png");
        });
    }

    create() {
        const tilemapConfig: Phaser.Types.Tilemaps.TilemapConfig = {};
        const map = this.scene.make.tilemap({ key: this.mapKey });
        this.tileSets.forEach((ts) => {
            this.tileSetImages[ts.name] = map.addTilesetImage(
                ts.name,
                ts.original.image.substring(
                    0,
                    ts.original.image.length - ".png".length
                ),
                ts.original.tilewidth,
                ts.original.tileheight,
                0,
                0,
                ts.first
            );
        });

        this.process(map, this.mapConfig.layers);
        this.processObjects(map, this.mapConfig.layers);
        return map;
    }

    process(map: Phaser.Tilemaps.Tilemap, layers: Layer[]) {
        layers.forEach((layer) => {
            if (layer.type === "group") {
                this.process(map, layer.layers);
            } else if (layer.type === "objectgroup") {
                // do it later
            } else {
                const layerProps = new LayerObject(layer);
                if (layerProps.getProp("collide")) {
                    if (this.scene?.player) {
                        const theLayer = map.createLayer(
                            layer.path,
                            this.tileSetImages[layer.tileset],
                            0,
                            0
                        );
                        theLayer.setCollisionByExclusion([-1]);
                        this.scene.physics.add.collider(
                            this.scene.player,
                            theLayer
                        );
                    }
                } else if (layerProps.getProp("depthSorting") as boolean) {
                    const tileSet = this.mapConfig.tilesets.find(
                        (t) => t.name == layer.tileset
                    );
                    if (this.scene?.player && tileSet) {
                        buildMap(this.scene, 0, 0, layer, tileSet);
                    }
                } else if (layerProps.getProp("type")) {
                    const type = layerProps.getProp("type") as string;

                    const action = this.layerActions[type];
                    if (action) {
                        const tiles = map.createLayer(
                            layer.path,
                            this.tileSetImages[layer.tileset],
                            0,
                            0
                        );
                        action(map, layer, this.scene);
                        tiles.visible = false;
                    }
                } else {
                    map.createLayer(
                        layer.path,
                        this.tileSetImages[layer.tileset],
                        0,
                        0
                    );
                }
            }
        });
    }

    processObjects(map: Phaser.Tilemaps.Tilemap, layers: Layer[]) {
        layers.forEach((layer) => {
            if (layer.type === "group") {
                this.processObjects(map, layer.layers);
            } else if (layer.type === "objectgroup") {
                layer.objects.forEach((layerObject) => {
                    const props = new LayerObject(layerObject);
                    const type = layerObject.class;
                    const action = this.actions[type];
                    if (action) {
                        action(props, this.scene);
                    }
                });
            }
        });
    }
}
