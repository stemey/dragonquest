import Phaser, { Scene } from "phaser";
import { Tag } from "@dragonquest/jsx/src/jsx-runtime";

export interface SpriteProps {
    frame: string;
}

export const Sprite: Tag<SpriteProps> = () => ({
    create(scene: Scene, props: SpriteProps) {
        const { frame } = props;
        return new Phaser.GameObjects.Sprite(scene, 0, 0, frame);
    },

    update(textObject: Phaser.GameObjects.Text, newProps: SpriteProps) {},
});
