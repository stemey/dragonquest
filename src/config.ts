import * as Phaser from "phaser";

export const config = {
    type: Phaser.AUTO,
    parent: "content",
    width: 640,
    height: 400,
    zoom: 2,
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: {
            debug: true,
            gravity: { y: 0 },
        },
    },
};
