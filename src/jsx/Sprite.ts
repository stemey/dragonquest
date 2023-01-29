import Phaser, { Scene } from "phaser";
import { Tag } from "@dragonquest/jsx/src/jsx-runtime";
import { setPosition } from "./utils";

export interface SpriteProps {
    frame: string;
    x?: number;
    y?: number;
    height?: number;
    width?: number;
}

function update(sprite: Phaser.GameObjects.Sprite, props: SpriteProps) {
    /* const scaleX = props.scaleX || 1;
    const scaleY = props.scaleY || scaleX;
    if (props.scaleX) {
        sprite.setScale(scaleX, scaleY);
    }*/
    const bounds = sprite.getBounds();
    const x = (props.x || 0) + bounds.width / 2;
    const y = (props.y || 0) + bounds.height / 2;
    setPosition(sprite, x, y);
    const previousScale = sprite.scale;
    if (props.width && props.height) {
        const scale = Math.min(
            props.width / (bounds.width / previousScale),
            props.height / (bounds.height / previousScale)
        );
        sprite.setScale(scale);
    } else if (props.width) {
        sprite.setScale(props.width / (bounds.width / previousScale));
    }

    return false;
}

export const Sprite: Tag<SpriteProps> = () => ({
    create(scene: Scene, props: SpriteProps) {
        const { frame } = props;
        const sprite = new Phaser.GameObjects.Sprite(scene, 0, 0, frame);
        update(sprite, props);
        return sprite;
    },

    update,
});