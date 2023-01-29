import Phaser, { Scene } from "phaser";
import { Tag } from "@dragonquest/jsx/src/jsx-runtime";

export interface TextProps {
    text: string;
    style: Phaser.Types.GameObjects.Text.TextStyle;
    x?: number;
    y?: number;
    width?:number;
}

export const Text: Tag<TextProps> = () => ({
    create(scene: Scene, props: TextProps) {
        const { text, style } = props;
        if (props.width) {
            style.fixedWidth=props.width
        }
        return new Phaser.GameObjects.Text(scene, 0, 0, text, style);
    },

    update(textObject: Phaser.GameObjects.Text, newProps: TextProps) {
        const { text, style } = newProps;
        if (newProps.width) {
            style.fixedWidth=newProps.width
        }
        textObject.setText(text);
        textObject.setStyle(style);
        textObject.setPosition(newProps.x || 0, newProps.y || 0);
        textObject.updateDisplayOrigin();
        return false;
    },
});