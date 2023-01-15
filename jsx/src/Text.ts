import Phaser, { Scene } from "phaser";
import { Tag } from "./jsx-runtime";

export interface TextProps {
    text: string;
    style: Phaser.Types.GameObjects.Text.TextStyle;
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
    },
});
