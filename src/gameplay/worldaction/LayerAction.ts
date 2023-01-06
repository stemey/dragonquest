import { AbstractWorld } from "../../scenes/AbstractWorld";
import { TileLayer } from "../../tile/Layer";

export type LayerAction = (
    map: Phaser.Tilemaps.Tilemap,
    layer: TileLayer,
    scene: AbstractWorld
) => void;
