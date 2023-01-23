import Phaser, { Scene } from "phaser";
import { Tag } from "@dragonquest/jsx/src/jsx-runtime";

export interface TextProps {
    text: string;
    style: Phaser.Types.GameObjects.Text.TextStyle;
    x?: number;
    y?: number;
}

export const Text: Tag<TextProps> = () => ({
    create(scene: Scene, props: TextProps) {
        const { text, style } = props;
        return new Phaser.GameObjects.Text(scene, 0, 0, text, style);
    },

    update(textObject: Phaser.GameObjects.Text, newProps: TextProps) {
        const { text, style } = newProps;
        textObject.setText(text);
        textObject.setStyle(style);
        textObject.setPosition(newProps.x || 0, newProps.y || 0);
        textObject.updateDisplayOrigin();
        return false;
    },
});
