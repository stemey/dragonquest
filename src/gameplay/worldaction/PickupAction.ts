import * as Phaser from "phaser";
import { AbstractWorld } from "../../scenes/AbstractWorld";
import { TileLayer } from "../../tile/Layer";

export const PickUpAction = (
    tilesetName: string,
    imageIndices: number[],
    pickupCallback: ArcadePhysicsCallback
) => {
    return (
        map: Phaser.Tilemaps.Tilemap,
        layer: TileLayer,
        scene: AbstractWorld
    ) => {
        const golds = scene.physics.add.group({
            classType: Phaser.GameObjects.Container,
        });
        const tileset = map.tilesets.find((t) => t.name === tilesetName);
        const firstGid = tileset?.firstgid || 0;
        imageIndices.forEach((imageIndex) => {
            const goldSprites = map.createFromTiles(
                firstGid + imageIndex,
                firstGid + imageIndex,
                { key: "scenery", frame: imageIndex },
                undefined,
                undefined,
                layer.name
            );
            goldSprites?.forEach((goldSprite) => {
                if (!scene.player) {
                    return;
                }
                golds.add(goldSprite);
                scene.physics.add.overlap(
                    scene.player,
                    goldSprite,
                    pickupCallback as any
                );
            });
        });
    };
};
