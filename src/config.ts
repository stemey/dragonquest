import * as Phaser from "phaser";

const debug =
    new URLSearchParams(window.location.search).get("debug") === "true";
export const dimension =  {width:window.visualViewport?.width,height:window.visualViewport?.height}  

export const config = {
    type: Phaser.AUTO,
    parent: "content",
    width: dimension.width,
    height: dimension.height,
    zoom: 1,
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
