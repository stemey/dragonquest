import * as Phaser from "phaser";

const debug =
    new URLSearchParams(window.location.search).get("debug") === "true";
const zoom = 2;
export const dimension = {
    width: (window.visualViewport?.width || 0) / zoom,
    height: (window.visualViewport?.height || 0) / zoom,
};

export const config = {
    type: Phaser.AUTO,
    parent: "content",
    width: dimension.width,
    height: dimension.height,
    zoom,
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
