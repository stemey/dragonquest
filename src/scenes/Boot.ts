import * as Phaser from "phaser";
import * as WebFont from "webfontloader";
import characters from "../../generated/config/global/characters.json";
import powers from "../../generated/config/global/powers.json";
import { DragonQuest } from "../gameplay/DragonQuest";
import { Characters } from "../gameplay/types/Characters";
import { Powers } from "../gameplay/types/Powers";
import { removeSchemaFromJson } from "../utils/removeSchemaFromJson";

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
        this.load.spritesheet(
            "VX Plants Tileset",
            "assets/tileset/VX Plants Tileset.png",
            {
                frameWidth: 32,
                frameHeight: 32,
            }
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

        this.load.json("tiled_meta_terrain", "assets/tileset/terrain.json");
        this.load.json("tiled_meta_plants", "assets/tileset/Plants.json");

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

        const cleanedCharacters: Characters = removeSchemaFromJson(characters);
        const cleanedPowers: Powers = removeSchemaFromJson(powers);

        Object.values(cleanedCharacters).forEach((character) => {
            if (!character.image) {
                console.warn("no image for character", character.name);
                return;
            }
            this.load.image(
                character.image,
                "assets/" + character.image + ".png"
            );
        });

        DragonQuest.init(cleanedCharacters, cleanedPowers);

        WebFont.load({
            google: {
                families: ["Bangers"],
            },
            active: this.fontsLoaded,
        });
    }

    create() {
        this.scene.start("/level/road");
    }

    fontsLoaded() {}
}
