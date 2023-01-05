import * as Phaser from "phaser";

const debug =
    new URLSearchParams(window.location.search).get("debug") === "true";

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
            debug,
            gravity: { y: 0 },
        },
        matter: {
            debug,
            gravity: {
                y: 0.3,
            },
        },
    },
};
