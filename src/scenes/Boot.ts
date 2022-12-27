import * as Phaser from "phaser";
import * as WebFont from "webfontloader";
import { characters } from "../gameplay/character/characters";

export default class extends Phaser.Scene {
    constructor() {
        super({ key: "BootScene" });
    }

    preload() {
        // map tiles
        this.load.image("terrain", "assets/tileset/terrain.png");
        this.load.image(
            "VX Architecture Tileset",
            "assets/tileset/VX Architecture Tileset.png"
        );
        this.load.image(
            "VX BuildingsTileset",
            "assets/tileset/VX BuildingsTileset.png"
        );
        this.load.image(
            "VX DungeonTileset",
            "assets/tileset/VX DungeonTileset.png"
        );
        this.load.image(
            "VX Interior Tileset",
            "assets/tileset/VX Interior Tileset.png"
        );
        this.load.image(
            "VX Plants Tileset",
            "assets/tileset/VX Plants Tileset.png"
        );
        this.load.image(
            "VX Scenery Tileset",
            "assets/tileset/VX Scenery Tileset.png"
        );
        this.load.image(
            "VX Shop Tileset",
            "assets/tileset/VX Shop Tileset.png"
        );
        this.load.image(
            "VX Winter Tileset",
            "assets/tileset/VX Winter Tileset.png"
        );

        this.load.tilemapTiledJSON("map", "assets/map/smallmap.json");
        this.load.tilemapTiledJSON("castle", "assets/map/castle.json");
        this.load.tilemapTiledJSON("road", "assets/levels/one/map/road.json");

        // load resources
        this.load.spritesheet("player", "assets/RPG_assets.png", {
            frameWidth: 16,
            frameHeight: 16,
        });

        this.load.spritesheet("shop", "assets/tileset/VX Shop Tileset.png", {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.spritesheet(
            "scenery",
            "assets/tileset/VX Scenery Tileset.png",
            { frameWidth: 32, frameHeight: 32 }
        );

        Object.values(characters.villains).forEach((villain) => {
            this.load.image(villain.image, "assets/" + villain.image + ".png");
        });
        Object.values(characters.npc).forEach((npc) => {
            this.load.image(npc.image, "assets/" + npc.image + ".png");
        });

        WebFont.load({
            google: {
                families: ["Bangers"],
            },
            active: this.fontsLoaded,
        });
    }

    create() {
        this.scene.start("RoadScene");
    }

    fontsLoaded() {}
}
